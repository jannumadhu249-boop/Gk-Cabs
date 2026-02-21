import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import CommonFooter from "../../components/footer/commonFooter";
import { URLS } from "../../url";
import axios from "axios";
import ZoneMap from "../Zones/Google-Map"; 

const AddPeakZones = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 17.385044, lng: 78.486671 }); 
  const [formData, setFormData] = useState({
    name: "",
    place: "", 
    priority: "",
    zoneType: "peak",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePolygonComplete = (coordinates) => {
    setPolygonCoordinates(coordinates);
  };

  // Geocode the entered address and update map center & place field
  const handleSearchLocation = async () => {
    if (!formData.place.trim()) {
      alert("Please enter a location to search.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: formData.place,
            key: URLS.GoogleMapsKey,
          },
        }
      );

      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        const formattedAddress = response.data.results[0].formatted_address;

        // Update map center
        setMapCenter({ lat: location.lat, lng: location.lng });

        // Update the place field with the official formatted address
        setFormData((prev) => ({
          ...prev,
          place: formattedAddress,
        }));
      } else {
        alert("Location not found. Please try a different search.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Error searching for location. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (polygonCoordinates.length < 3) {
      alert("Please draw a polygon with at least 3 points on the map.");
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
        place: formData.place, 
        priority: formData.priority,
        locations: locations,
        zoneType: formData.zoneType,
        status: status ? "active" : "inactive",
      };

      const res = await axios.post(URLS.AddZone, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Add peakzone response:", res.data);
      alert("Peakzone Added Successfully");

      // Reset form
      setFormData({
        name: "",
        place: "",
        priority: "",
        zoneType: "peak",
      });
      setPolygonCoordinates([]);
      setMapCenter({ lat: 17.385044, lng: 78.486671 }); 
      setStatus(true);
    } catch (err) {
      console.error(err);
      setError("Failed to Add Peakzone");
      alert("Error adding peakzone. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/Peakzones");
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title"> 

                <h4>Create PeakZones</h4>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <div className="page-btn">
                  <Link to="/Peakzones" className="btn btn-secondary">
                    <i className="feather icon-arrow-left me-2" />
                    Back to Peakzones
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <form onSubmit={handleSubmit}>
                <div className="add-Addzones">
                  <div className="card border mb-4">
                    <h2 className="card-header" id="headingSpacingOne">
                      <div className="d-flex align-items-center justify-content-between flex-fill">
                        <h5 className="d-flex align-items-center">
                          <i className="feather icon-info text-primary me-2" />
                          <span>Peakzones Information</span>
                        </h5>
                      </div>
                    </h2>

                    <div className="accordion-body border-top">
                      <div className="row">
                        <div className="col-sm-6 col-12 w-100">
                          <div className="mb-3">
                            <label className="form-label">Zone Name</label>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter Zone Name"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Unified Search */}
                      <div className="row">
                        <div className="col-sm-6 col-12 w-100">
                          <div className="mb-3 list position-relative">
                            <label className="form-label">
                              Search Location 
                            </label>
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                name="place"
                                className="form-control"
                                value={formData.place}
                                onChange={handleChange}
                                placeholder="Enter a location to center the map"
                                // required
                              />
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleSearchLocation}
                                disabled={loading}
                              >
                                Search
                              </button>
                            </div>
                            <small className="text-muted">
                              Type a location and click Search to center the map.
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="row">
                        <div className="col-sm-6 col-12 w-100">
                          <div className="mb-3 list position-relative">
                            <label className="form-label">Priority</label>
                            <input
                              type="number"
                              name="priority"
                              className="form-control"
                              value={formData.priority}
                              onChange={handleChange}
                              placeholder="Enter Priority"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Map */}
                      <div className="row">
                        {/* <div className="col-sm-6 col-12"> */}
                          <div className="mb-3 list position-relative">
                            <label className="form-label">
                              Draw Zone on Map
                            </label>
                          </div>
                          <ZoneMap
                            onPolygonComplete={handlePolygonComplete}
                            center={mapCenter} // Pass center to map
                          />
                        {/* </div> */}
                      </div>

                      {/* Status Toggle */}
                      <div className="row">
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="row">
                            <div className="col-lg-6 col-sm-6 col-12">
                              <div className="mb-3">
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="col-lg-12">
                  <div className="d-flex align-items-center justify-content-end mb-4">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Zone"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
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
                    <li className="mb-2">
                      Use the search field to center the map on a specific place.
                    </li>
                  </ul>
                  <img
                    src="/src/assets/img/taxido-osm.gif"
                    alt=""
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <CommonFooter />
      </div>
    </>
  );
};

export default AddPeakZones;