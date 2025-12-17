import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import SearchIcon from "@mui/icons-material/Search";

// Fix default leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Egypt boundaries
const egyptBounds = [
  [22.0, 24.7],
  [31.7, 37.0],
];

// Search Control
function SearchControl({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const map = useMap();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=eg&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        if (
          lat >= egyptBounds[0][0] &&
          lat <= egyptBounds[1][0] &&
          lon >= egyptBounds[0][1] &&
          lon <= egyptBounds[1][1]
        ) {
          map.flyTo([lat, lon], 15);
          onSearch({
            address: display_name,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
        } else {
          alert("الرجاء اختيار موقع داخل حدود مصر");
        }
      } else {
        alert("لم يتم العثور على الموقع، الرجاء المحاولة بعنوان آخر");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء البحث");
    }
  };

  return (
    <Box sx={{ position: "absolute", top: 10, left: 10, zIndex: 1000, width: "calc(100% - 20px)", maxWidth: "400px" }}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="ابحث عن عنوان في مصر..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
            endAdornment: (
              <Button type="submit" variant="contained" size="small" sx={{ backgroundColor: "#03235A", color: "white", "&:hover": { backgroundColor: "#021f4d" } }}>
                بحث
              </Button>
            ),
            sx: { backgroundColor: "white", borderRadius: "4px" },
          }}
        />
      </form>
    </Box>
  );
}

// Location Marker
function LocationMarker({ initialPosition, onLocationSelect }) {
  const [position, setPosition] = useState(initialPosition);
  useMapEvents({
    click: async (e) => {
      if (
        e.latlng.lat >= egyptBounds[0][0] &&
        e.latlng.lat <= egyptBounds[1][0] &&
        e.latlng.lng >= egyptBounds[0][1] &&
        e.latlng.lng <= egyptBounds[1][1]
      ) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
          );
          const data = await response.json();
          const address = data.display_name || "الموقع المحدد";

          const newPos = { address, latitude: e.latlng.lat, longitude: e.latlng.lng };
          setPosition(newPos);
          onLocationSelect(newPos);
        } catch (error) {
          console.error(error);
          const newPos = { address: "الموقع المحدد", latitude: e.latlng.lat, longitude: e.latlng.lng };
          setPosition(newPos);
          onLocationSelect(newPos);
        }
      } else {
        alert("الرجاء اختيار موقع داخل حدود مصر");
      }
    },
  });

  const map = useMap();
  useEffect(() => {
    if (initialPosition && initialPosition.latitude) {
      map.flyTo([initialPosition.latitude, initialPosition.longitude], 15);
    }
  }, [initialPosition, map]);

  return position?.latitude ? <Marker position={[position.latitude, position.longitude]}><Popup>{position.address}</Popup></Marker> : null;
}

// Main Component
export default function MapSelector({ initialPosition, onLocationSelect }) {
  return (
    <Box sx={{ height: 400, width: '100%', mt: 2, position: 'relative' }}>
      <MapContainer
        center={[26.8206, 30.8025]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        maxBounds={egyptBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SearchControl onSearch={onLocationSelect} />
        <LocationMarker initialPosition={initialPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </Box>
  );
}
