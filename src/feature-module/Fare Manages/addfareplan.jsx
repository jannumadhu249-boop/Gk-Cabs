
import { useState } from "react";
import { Link } from "react-router-dom";

const AddFarePlan = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    farePlanName: "",
    description: "",
    priority: "",
    radius: "",
  });

  // Common change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Fare Plan Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Fare Plan</h4>
          </div>
          <Link to="/fareplans" className="btn btn-secondary">
          <i className="feather icon-arrow-left me-2" />
            Back to Fare Plan
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card border mb-4">
            <div className="card-body">

              {/* Service Name */}
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <select
                  type="text"
                  name="serviceName"
                  className="form-select"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                >
                    <option>Select Serivce</option>
                    <option>City Ride</option>
                    <option>Outstation Oneway</option>
                    <option>outastation Round Trip</option>
                    <option>Rental Hourly Package</option>
                    </select>
              </div>

              {/* Fare Plan Name */}
              <div className="mb-3">
                <label className="form-label">Fare Plan Name</label>
                <input
                  type="text"
                  name="farePlanName"
                  className="form-control"
                  value={formData.farePlanName}
                  onChange={handleChange}
                  placeholder="Enter Plan Name"
                  required
                />
              </div>

              {/* Description */}
                {/* <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    rows="3"
                    required
                    />
                </div> */}

              {/* Priority */}
              <div className="mb-3">
                <label className="form-label">Priority</label>
                <input
                  type="number"
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                  placeholder="Enter Priority"
                />
              </div>

              {/* Down Grade */}
              {/* <div className="mb-3">
                <label className="form-label">Radius</label>
                <input
                  type="text"
                  name="radius"
                  className="form-control"
                  value={formData.radius}
                  onChange={handleChange}
                  placeholder="Enter Radius"
                />
              </div> */}

              {/* Submit Button */}
              <div className="text-end">
                <button type="submit" className="btn btn-success">
                  Add Plan
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFarePlan;
