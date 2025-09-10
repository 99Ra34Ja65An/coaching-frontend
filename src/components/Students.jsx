import React, { useEffect, useState } from "react";
import API from "../utils/api";

const Students = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (err) {
      alert("Error fetching students");
    }
  };

  const toggleStudent = async (id) => {
    try {
      await API.put(`/students/${id}/toggle`);
      fetchStudents();
    } catch (err) {
      alert("Error updating student status");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Manage Students</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="border p-2">{student.name}</td>
              <td className="border p-2">{student.email}</td>
              <td className="border p-2">
                {student.active ? "Active" : "Inactive"}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => toggleStudent(student._id)}
                  className={`px-3 py-1 rounded ${
                    student.active ? "bg-red-500" : "bg-green-500"
                  } text-white`}
                >
                  {student.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
