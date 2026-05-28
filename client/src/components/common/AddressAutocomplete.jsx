import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Loader2, X, Search } from 'lucide-react';

const AddressAutocomplete = ({
  value,
  onChange,
  placeholder = 'Search for your address...',
  className = '',
  variant = 'default', // 'default' (BookingSection style) or 'modal' (BookingModal style)
  required = false,
  name = 'address',
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);
  const abortControllerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Fetch predictions from Nominatim (OpenStreetMap) — FREE, no API key needed
  const fetchPredictions = useCallback(async (inputValue) => {
    if (!inputValue || inputValue.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: inputValue,
          format: 'json',
          addressdetails: '1',
          limit: '6',
          countrycodes: 'in',
          'accept-language': 'en',
        }),
        {
          signal: abortControllerRef.current.signal,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();

      const formatted = data.map((item) => {
        const addr = item.address || {};
        // Build a clean main text (area/locality/road)
        const mainParts = [
          addr.road || addr.neighbourhood || addr.suburb || addr.hamlet || addr.village,
          addr.city || addr.town || addr.county,
        ].filter(Boolean);

        // Build secondary text (state, country)
        const secondaryParts = [
          addr.state_district,
          addr.state,
          addr.postcode,
        ].filter(Boolean);

        return {
          id: item.place_id,
          mainText: mainParts.join(', ') || item.display_name.split(',').slice(0, 2).join(','),
          secondaryText: secondaryParts.join(', ') || item.display_name.split(',').slice(2).join(',').trim(),
          fullAddress: item.display_name,
          lat: item.lat,
          lon: item.lon,
        };
      });

      setSuggestions(formatted);
      setShowDropdown(formatted.length > 0);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Nominatim fetch error:', err);
        setSuggestions([]);
        setShowDropdown(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val, name);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchPredictions(val);
    }, 400);
  };

  // Handle suggestion selection
  const handleSelect = (suggestion) => {
    onChange(suggestion.fullAddress, name);
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Use current location — reverse geocode with Nominatim
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
            new URLSearchParams({
              lat: latitude.toString(),
              lon: longitude.toString(),
              format: 'json',
              addressdetails: '1',
              'accept-language': 'en',
            })
          );
          const data = await response.json();
          if (data && data.display_name) {
            onChange(data.display_name, name);
            setShowDropdown(false);
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          alert('Unable to detect address from location.');
        } finally {
          setLocatingUser(false);
        }
      },
      (error) => {
        setLocatingUser(false);
        console.error('Location error:', error);
        alert('Unable to get your location. Please allow location access.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleClear = () => {
    onChange('', name);
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong className="font-black text-black">{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  // ─── Shared Dropdown Content ─────────────────────────────────────────
  const renderDropdown = (isModal = false) => {
    if (!showDropdown || suggestions.length === 0) return null;

    return (
      <div
        ref={dropdownRef}
        className={`absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 shadow-2xl z-50 overflow-hidden ${
          isModal ? 'rounded-2xl' : ''
        }`}
        style={{ animation: 'fadeSlideDown 0.2s ease-out' }}
      >
        {/* Current Location Option */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locatingUser}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-blue-50 border-b border-neutral-100 transition-colors group/cur"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover/cur:bg-blue-100 transition-colors">
            {locatingUser ? (
              <Loader2 size={14} className="animate-spin text-blue-600" />
            ) : (
              <Navigation size={14} className="text-blue-600" />
            )}
          </div>
          <div>
            <div className="text-xs font-black text-blue-600 uppercase tracking-wider">
              {locatingUser ? 'Detecting Location...' : 'Use Current Location'}
            </div>
            <div className="text-[10px] text-neutral-400 font-medium">Detect via GPS</div>
          </div>
        </button>

        {/* Suggestions */}
        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion.id}
            onClick={() => handleSelect(suggestion)}
            className="w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-neutral-50 border-b border-neutral-50 last:border-0 transition-colors group/item"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-neutral-100 transition-colors">
              <MapPin size={14} className="text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-black truncate">
                {highlightMatch(suggestion.mainText, value)}
              </div>
              <div className="text-xs text-neutral-400 font-medium truncate">
                {suggestion.secondaryText}
              </div>
            </div>
          </button>
        ))}

        {/* OpenStreetMap attribution */}
        <div className={`px-5 py-2 bg-neutral-50 flex items-center justify-end ${isModal ? 'rounded-b-2xl' : ''}`}>
          <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">
            Powered by OpenStreetMap
          </span>
        </div>
      </div>
    );
  };

  // ─── Action Buttons (shared) ─────────────────────────────────────────
  const renderActionButtons = (positionClass = '') => (
    <div className={`flex items-center gap-1 ${positionClass}`}>
      {isLoading && (
        <Loader2 size={14} className="animate-spin text-neutral-300" />
      )}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X size={14} className="text-neutral-400" />
        </button>
      )}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={locatingUser}
        className="p-1.5 rounded-full hover:bg-blue-50 transition-colors group/loc"
        title="Use current location"
      >
        {locatingUser ? (
          <Loader2 size={14} className="animate-spin text-blue-600" />
        ) : (
          <Navigation size={14} className="text-neutral-400 group-hover/loc:text-blue-600 transition-colors" />
        )}
      </button>
    </div>
  );

  // ─── Default variant (BookingSection bottom-border style) ────────────
  if (variant === 'default') {
    return (
      <div className={`relative ${className}`}>
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">
          Address *
        </label>

        <div className="relative group">
          <div className="relative flex items-center">
            <Search
              size={16}
              className={`absolute left-0 transition-colors duration-300 ${
                isFocused ? 'text-blue-600' : 'text-neutral-300'
              }`}
            />
            <input
              ref={inputRef}
              type="text"
              name={name}
              value={value}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              onBlur={() => setIsFocused(false)}
              required={required}
              placeholder={placeholder}
              autoComplete="off"
              className="w-full border-b-2 border-neutral-100 bg-transparent pl-7 pr-20 py-4 text-sm font-bold text-black placeholder:text-neutral-300 focus:outline-none focus:border-blue-600 transition-all"
            />
            {renderActionButtons('absolute right-0')}
          </div>

          {renderDropdown(false)}
        </div>
      </div>
    );
  }

  // ─── Modal variant (BookingModal card/bordered style) ────────────────
  return (
    <div className={`relative ${className}`}>
      <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">
        Service Address
      </label>

      <div className="relative">
        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-black pointer-events-none z-10" size={20} />

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Ex: 123 Business Road, Ahmedabad, Gujarat"
            autoComplete="off"
            className="input-field pl-14 pr-20 py-4"
          />
          {renderActionButtons('absolute right-4 top-1/2 -translate-y-1/2')}
        </div>

        {/* Validation message */}
        {value && value.trim().length < 10 && (
          <p className="text-red-500 text-xs mt-2 font-semibold">Address must be at least 10 characters long</p>
        )}

        {renderDropdown(true)}
      </div>
    </div>
  );
};

export default AddressAutocomplete;
