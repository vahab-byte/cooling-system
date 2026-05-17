import db from '../config/db.js';

// Generate URL-friendly slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * GET /api/v1/blog — List all published posts (paginated, filterable)
 */
export const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, featured } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE is_published = true';
    const params = [];
    let paramIndex = 1;

    if (category && category !== 'All') {
      whereClause += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (featured === 'true') {
      whereClause += ' AND is_featured = true';
    }

    if (search) {
      whereClause += ` AND (
        to_tsvector('english', title || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')) 
        @@ plainto_tsquery('english', $${paramIndex})
        OR title ILIKE $${paramIndex + 1}
      )`;
      params.push(search, `%${search}%`);
      paramIndex += 2;
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM blog_posts ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated posts (exclude full content for listing)
    const result = await db.query(
      `SELECT id, title, slug, excerpt, cover_image, category, tags, 
              author_name, author_role, author_avatar, read_time_minutes, 
              is_featured, views, created_at, updated_at
       FROM blog_posts 
       ${whereClause}
       ORDER BY is_featured DESC, created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/blog/categories — Get all unique blog categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT category, COUNT(*) as count 
       FROM blog_posts 
       WHERE is_published = true 
       GROUP BY category 
       ORDER BY count DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/blog/:slug — Get single post by slug
 */
export const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await db.query(
      `SELECT * FROM blog_posts WHERE slug = $1 AND is_published = true`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    const post = result.rows[0];

    // Increment view count (non-blocking)
    db.query('UPDATE blog_posts SET views = views + 1 WHERE id = $1', [post.id]).catch(() => {});

    // Get related posts (same category, exclude current)
    const relatedResult = await db.query(
      `SELECT id, title, slug, excerpt, cover_image, category, author_name, 
              read_time_minutes, created_at 
       FROM blog_posts 
       WHERE category = $1 AND id != $2 AND is_published = true
       ORDER BY created_at DESC
       LIMIT 3`,
      [post.category, post.id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...post,
        relatedPosts: relatedResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/blog — Create new blog post (admin only)
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, cover_image, category, tags, 
            author_name, author_role, author_avatar, read_time_minutes, 
            is_featured, is_published, meta_title, meta_description } = req.body;

    if (!title || !excerpt || !content || !category || !author_name) {
      return res.status(400).json({ success: false, error: 'Missing required fields: title, excerpt, content, category, author_name' });
    }

    const slug = generateSlug(title);

    // Check for duplicate slug
    const existing = await db.query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'A post with a similar title already exists' });
    }

    const result = await db.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, category, tags,
       author_name, author_role, author_avatar, read_time_minutes, is_featured, is_published,
       meta_title, meta_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [title, slug, excerpt, content, cover_image, category, tags || [],
       author_name, author_role, author_avatar, read_time_minutes || 5,
       is_featured || false, is_published !== false, meta_title, meta_description]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/blog/:id — Update blog post (admin only)
 */
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, cover_image, category, tags,
            author_name, author_role, author_avatar, read_time_minutes,
            is_featured, is_published, meta_title, meta_description } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    const fields = { title, excerpt, content, cover_image, category, tags,
                     author_name, author_role, author_avatar, read_time_minutes,
                     is_featured, is_published, meta_title, meta_description };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    // Update slug if title changed
    if (title) {
      updates.push(`slug = $${paramIndex}`);
      values.push(generateSlug(title));
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    values.push(id);
    const result = await db.query(
      `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/blog/:id — Delete blog post (admin only)
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
