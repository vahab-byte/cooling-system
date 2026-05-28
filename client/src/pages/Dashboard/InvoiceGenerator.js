export const generateInvoiceHTML = (booking, user) => {
  const date = new Date(booking.booking_date).toLocaleDateString();
  const invoiceId = `INV-AF-${booking.id.slice(0, 8).toUpperCase()}`;
  const total = Number(booking.total_amount || booking.services?.price_base || 0);

  return `
    <html>
      <head>
        <title>Invoice ${invoiceId}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #020617; padding: 40px; margin: 0; background: #fff; }
          .invoice-box { max-w-full; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; }
          .title { font-size: 28px; font-weight: 900; color: #0ea5e9; letter-spacing: -1px; }
          .details { text-align: right; font-size: 14px; color: #64748b; }
          .info { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px; }
          .info strong { color: #020617; }
          table { w-full; border-collapse: collapse; width: 100%; margin-bottom: 40px; }
          th { background: #f8fafc; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
          td { padding: 16px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          .total-row { font-weight: bold; font-size: 18px; }
          .total-row td { border-bottom: none; }
          .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="title">ArcticFresh</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Premium AC Service Station</div>
            </div>
            <div class="details">
              <strong>INVOICE</strong><br>
              ${invoiceId}<br>
              Date: ${date}
            </div>
          </div>

          <div class="info">
            <div>
              <strong>Billed To:</strong><br>
              ${user?.user_metadata?.full_name || 'Valued Client'}<br>
              ${booking.address}<br>
              ${user?.email}
            </div>
            <div style="text-align: right;">
              <strong>Payment Status:</strong><br>
              <span style="color: #10b981; font-weight: bold; text-transform: uppercase;">PAID IN FULL</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${booking.services?.title}</strong><br>
                  <span style="color: #64748b; font-size: 12px;">${booking.services?.category}</span>
                </td>
                <td style="text-align: right;">₹${total.toLocaleString()}</td>
              </tr>
              <!-- Parts could go here if available -->
              <tr class="total-row">
                <td style="text-align: right;">Total Amount</td>
                <td style="text-align: right; color: #0ea5e9;">₹${total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Thank you for choosing ArcticFresh. For any issues, contact support@arcticfresh.com.
          </div>
        </div>
      </body>
    </html>
  `;
};

export const downloadInvoice = (booking, user) => {
  const html = generateInvoiceHTML(booking, user);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
};
