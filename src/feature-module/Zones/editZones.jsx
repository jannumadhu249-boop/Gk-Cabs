import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CommonFooter from "../../components/footer/commonFooter";
import ZoneMap from "./Google-Map";
import { URLS } from "../../url";

const Editzones = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    searchLocation: "", // will be sent as "place"
    priority: "",
    zoneType: "peak",
  });

  // Fetch zone by ID
  useEffect(() => {
    if (!id) return;
    fetchZoneById();
  }, [id]);

  const fetchZoneById = async () => {
    try {
      const res = await axios.post(
        URLS.GetZoneById,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const zone = res.data.zone;

      // `place` is an array – take first element or join
      const placeValue = Array.isArray(zone.place) ? zone.place[0] : zone.place;

      setFormData({
        name: zone.name,
        searchLocation: placeValue,
        priority: zone.priority,
        zoneType: zone.zoneType,
      });

      setStatus(zone.status === "active");

      // Convert locations to map format
      const coords = zone.locations.map((loc) => ({
        lat: loc.latitude,
        lng: loc.longitude,
      }));
      setPolygonCoordinates(coords);
    } catch (err) {
      console.error(err);
      setError("Failed to load zone data. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePolygonComplete = (coordinates) => {
    setPolygonCoordinates(coordinates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (polygonCoordinates.length < 3) {
      alert("Please draw a valid polygon (minimum 3 points)");
      return;
    }

    try {
      setLoading(true);

      const locations = polygonCoordinates.map((point) => ({
        latitude: point.lat,
        longitude: point.lng,
      }));

      const payload = {
        name: formData.name,
        place: formData.searchLocation,
        priority: formData.priority,
        zoneType: formData.zoneType,
        locations,
        status: status ? "active" : "inactive",
      };

      await axios.put(`${URLS.EditZone}/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Zone Updated Successfully");
      navigate("/Zones");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update zone";
      setError(msg);
      alert(`Update failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/Zones");
  };

  if (fetchLoading) {
    return (
      <div className="page-wrapper">
        <div
          className="content d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>Edit Zone</h4>
          <Link to="/Zones" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" /> Back to Zones
          </Link>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
              aria-label="Close"
            />
          </div>
        )}

        <div className="row">
          {/* LEFT COLUMN – FORM + MAP */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Zone Name */}
                  <div className="mb-3">
                    <label className="form-label">Zone Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Search Location */}
                  <div className="mb-3">
                    <label className="form-label">Search Location</label>
                    <input
                      type="text"
                      name="searchLocation"
                      className="form-control"
                      value={formData.searchLocation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Priority */}
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <input
                      type="number"
                      name="priority"
                      className="form-control"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Zone Type */}
                  {/* <div className="mb-3">
                    <label className="form-label">Zone Type</label>
                    <select
                      name="zoneType"
                      className="form-select"
                      value={formData.zoneType}
                      onChange={handleChange}
                      required
                    >
                      <option value="peak">Peak</option>
                      <option value="normal">Normal</option>
                      <option value="off-peak">Off-Peak</option>
                    </select>
                  </div> */}

                  {/* Map (inside the form, after fields) */}
                  <div className="mb-4">
                    <label className="form-label">
                      Zone Area (draw / edit)
                    </label>
                    <ZoneMap
                      onPolygonComplete={handlePolygonComplete}
                      initialCoordinates={polygonCoordinates}
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="mb-4">
                    <label className="form-label">Status</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="zoneStatus"
                        checked={status}
                        onChange={() => setStatus(!status)}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="zoneStatus"
                      >
                        {status ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Updating...
                        </>
                      ) : (
                        "Update Zone"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – INSTRUCTIONS CARD */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Instructions</h5>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    Click on the map to move to the desired location.
                  </li>
                  <li className="mb-2">
                    You need at least three points to create a zone.
                  </li>
                  <li className="mb-2">
                    Use the drawing tool to outline the zone.
                  </li>
                </ul>
                <img
                  src="/src/assets/img/taxido-osm.gif"
                  alt="Zone drawing instructions"
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default Editzones;
