"use client";
"use client";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Link from "next/link";

function EditForm({ row, onUpdate, onClose }) {
  const [formData, setFormData] = useState(row);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/update/${row.id}`, formData);
      onUpdate(formData);
      onClose(); // Close the popup form after updating
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="edit-form-overlay">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Please enter your data below
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name*"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-3 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone number*"
                  autoComplete="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-3 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email*"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-3 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <input
                  id="hobbies"
                  name="hobbies"
                  type="text"
                  placeholder="Hobbies*"
                  required
                  value={formData.hobbies}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-3 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [rows, setRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    fetchRows();
  }, []);

  const handleSendEmail = async () => {
    console.log("Selected rows:", selectionModel); // Check if selected rows are logged correctly

    // Filter rows based on selectionModel to get selected rows
    const selectedRows = rows.filter((row) => selectionModel.includes(row._id)); // Use _id for matching
    console.log("Selected rows data:", selectedRows); // Check if selected rows data is logged correctly

    // Prepare selected data for email sending
    const selectedData = selectedRows.map((row) => ({
      name: row.name,
      email: row.email,
      phoneNumber: row.phoneNumber,
      hobbies: row.hobbies,
    }));

    // Construct the email body
    const emailBody = selectedData
      .map(
        (item) => `
          Name: ${item.name}
          Email: ${item.email}  
          Phone Number: ${item.phoneNumber}
          Hobbies: ${item.hobbies}
          ---------------------------------
        `
      )
      .join("\n");

    try {
      const response = await axios.post("http://localhost:8000/send-email", {
        data: selectedData,
        recipient: "info@redpositive.in",
        emailBody: emailBody, // Pass the email body to the server
      });
      console.log("Email sent successfully.");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const fetchRows = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectionModelChange = (newSelection) => {
    setSelectionModel(newSelection.selectionModel);
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(`${API_URL}/delete/${row.id}`);
      await fetchRows();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = (row) => {
    setEditingRow(row);
    setIsFormOpen(true);
  };

  const handleSave = (updatedData) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedData.id ? updatedData : row))
    );
    setEditingRow(null);
    setIsFormOpen(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      headerClassName: "header",
      cellClassName: "cell",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerClassName: "header",
      cellClassName: "cell",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 200,
      headerClassName: "header",
      cellClassName: "cell",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      headerClassName: "header",
      cellClassName: "cell",
    },
    {
      field: "hobbies",
      headerName: "Hobbies",
      width: 200,
      headerClassName: "header",
      cellClassName: "cell",
    },
    {
      field: "updateDelete",
      headerName: "Update/Delete",
      width: 200,
      headerClassName: "header",
      cellClassName: "cell",
      renderCell: (params) => (
        <div>
          <button onClick={() => handleUpdate(params.row)}>Update</button>
          <button onClick={() => handleDelete(params.row)}>Delete</button>
        </div>
      ),
    },
    {
      field: "checkbox",
      headerName: "Select",
      width: 100,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectionModel.includes(params.row._id)}
          onChange={() => handleCheckboxChange(params.row._id)}
        />
      ),
    },
  ];

  const handleCheckboxChange = (id) => {
    if (selectionModel.includes(id)) {
      setSelectionModel(
        selectionModel.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectionModel([...selectionModel, id]);
    }
  };

  return (
    <div className="flex flex-col justify-center alignItems-center overflow-hidden">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="data-grid-container">
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id}
            pageSizeOptions={[5, 10]}
            checkboxSelection={true}
            selectionModel={selectionModel} // Pass selectionModel state to DataGrid
            onSelectionModelChange={handleSelectionModelChange} // Bind selection change handler
          />
          <Stack spacing={160} direction="row" className="py-5 m-5">
            <Link href="/form">
              <Button className="text-indigo-500 border border-indigo-500">Add</Button>
            </Link>
            <Button
              variant="contained"
              className="bg-indigo-500"
              onClick={handleSendEmail}
            >
              Send
            </Button>
          </Stack>
          {isFormOpen && (
            <EditForm
              row={editingRow}
              onUpdate={handleSave}
              onClose={() => setIsFormOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
