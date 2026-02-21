import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../routes/all_routes";
import { URLS } from "../../url";

const EditVehicleGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const route = all_routes;

  const [status, setStatus] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    downGrade: "",
  });

  // Fetch Vehicle Group by ID
  useEffect(() => {
    if (!id) return;
    fetchVehicleGroupById();
  }, [id]);

  const fetchVehicleGroupById = async () => {
    setFetchLoading(true);
    setError("");
    try {
      const res = await axios.post(
        URLS.GetVehicleGroupById, // endpoint
        { id }, // body with id
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const vehicleGroup = res.data.group || res.data;

      setFormData({
        name: vehicleGroup.name || "",
        description: vehicleGroup.description || "",
        priority: vehicleGroup.priority || "",
        downGrade: vehicleGroup.downGrade || "",
        status: vehicleGroup.status === "active",
      });

      setStatus(vehicleGroup.status === "active");
    } catch (err) {
      console.error(err);
      setError("Failed to load vehicle group data. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle downGrade as checkbox (if needed) – adjust UI accordingly
  const handleDownGradeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      downGrade: e.target.checked ? "" : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      description: formData.description,
      priority: formData.priority,
      downGrade: formData.downGrade,
      status: status ? "active" : "inactive",
    };

    try {
      await axios.put(`${URLS.EditVehicleGroup}/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Success – navigate back to vehicle group list
      navigate(route.vehiclegroups);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Failed to update vehicle group. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-wrapper">
        <div className="content text-center py-5">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">
            <h4>Edit Vehicle Group</h4>
          </div>
          <Link to={route.vehiclegroups} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Vehicle Group
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
                {/* Group Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Group Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Group Name"
                    required
                  />
                </div>

                {/* Priority */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Priority</label>
                  <input
                    type="number"
                    name="priority"
                    className="form-control"
                    placeholder="Enter Priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                {/* Description */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    required
                  />
                </div>

                {/* Down Grade */}
                <div className="col-md-6 mb-3">
                  <label className="form-label d-block">Down Grade</label>
                  <input
                    className="form-control"
                    type="number"
                    name="downGrade"               // ← add name to match state key
                    value={formData.downGrade}
                    onChange={handleChange}         // ← use the common handler
                    placeholder="Enter Grade"
                  />
                </div>
              </div>

              <div className="row">
                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="statusSwitch"
                      checked={status}
                      onChange={() => setStatus(!status)}
                    />
                    <label className="form-check-label" htmlFor="statusSwitch">
                      {status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button
                  type="submit"
                  className="btn btn-outline-success"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Vehicle Group"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleGroup;
