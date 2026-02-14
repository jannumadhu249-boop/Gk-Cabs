import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CouponData } from "../../core/json/Coupons";
import PrimeDataTable from "../../components/data-table";

const ViewDriverDetails = () => {
  const [tableData, setTableData] = useState(
    CouponData.map((item) => ({
      ...item,
      Status: item.Status ?? true,
    })),
  );

  const [rows] = useState("");

  /* ===================== COLUMNS ===================== */
  const columns = [
    {
      header: "Ride Number",
      field: "ridenumber",
    },
    {
      header: "Driver",
      field: "driver",
    },
    {
      header: "Service",
      field: "service",
    },
    {
      header: "Service Category",
      field: "servicecategory",
    },
    {
      header: "Ride Status",
      field: "",
    },
    {
      header: "Total",
      field: "total",
    },
    {
      header: "Created Date",
      body: (row) =>
        row?.date
          ? new Date(row.date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
            })
          : "--",
    },
    {
      header: "Actions",
      body: () => (
        <div className="view-action">
          <Link className="me-2 p-2" to="/rideDetails" title="Ride Details">
            <i className="ti ti-eye" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="container-fluid p-4 bg-light min-vh-100">
        {/* ================= TOP SECTION ================= */}
        <div className="row g-4">
          {/* Personal Information */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Personal Information</h5>

                <div
                  className="d-flex align-items-center mb-4"
                  style={{
                    backgroundImage: "url('/src/assets/img/bg-img-000.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                    backgroundColor: "#f8f9fa",
                    padding: "23px 29px",
                  }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "linear-gradient(135deg, #e6f4f1, #cdebe3)",
                      fontSize: "28px",
                      color: "#198754",
                      fontWeight: "600",
                    }}
                  >
                    R
                  </div>

                  <div>
                    <h5 className="mb-1" style={{ fontSize: "24px" }}>
                      Sharath Kumar
                    </h5>
                    <div className="text-warning">
                      Rating
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="ms-1" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <p>
                      <strong>Contact :</strong> +93 123456789
                    </p>
                    <p>
                      <strong>Email :</strong> rider@example.com
                    </p>
                  </div>
                  <div className="col-6 border-start">
                    <p>
                      <strong>Total Rides :</strong> 0
                    </p>
                    <p>
                      <strong>Wallet :</strong> 0.00
                    </p>
                    <p>
                      <strong>Total Earnings :</strong> 0.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Reviews */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Driver Documents</h5>

                  <Link to="/driverDocument" className="btn btn-success btn-sm">
                    View All
                  </Link>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Document</th>
                        <th>Status</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-5">
                          No documents available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIDER HISTORY ================= */}
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-body">
            <h5 className="fw-bold mb-4">Rider History</h5>

            <PrimeDataTable
              column={columns}
              data={tableData}
              totalRecords={tableData.length}
              rows={rows}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDriverDetails;
