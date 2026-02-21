import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../routes/all_routes";
import { URLS } from "../../url";

const AddVehicleGroup = () => {
  const navigate = useNavigate();
  const route = all_routes;

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    downGrade: "false", // default to "false"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle downgrade checkbox – sets "true"/"false"
  const handleDownGradeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      downGrade: e.target.checked ? "true" : "false",
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
      await axios.post(URLS.AddVehicleGroup, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(route.vehiclegroups);
    } catch (err) {
      console.error("Add vehicle group error:", err);
      setError("Failed to add vehicle group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">
            <h4>Add Vehicle Group</h4>
          </div>
          <Link to="/Vehicle-Group" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Vehicle Group
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

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

                <div className="col-md-6 mb-3">
                  <label className="form-label d-block">Down Grade</label>
                  <input
                    className="form-control"
                    type="number"          // or "text" if you prefer
                    id="downGrade"
                    name="downGrade"       // add name attribute to match formData key
                    value={formData.downGrade}
                    onChange={handleChange} // use the common handleChange
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
                  {loading ? "Adding..." : "Add Vehicle"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleGroup;