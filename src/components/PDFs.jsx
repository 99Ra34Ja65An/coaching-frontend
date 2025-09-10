import React, { useEffect, useState } from "react";
import API from "../utils/api";

const PDFs = () => {
  const [pdfs, setPdfs] = useState([]);
  const [link, setLink] = useState("");

  const fetchPdfs = async () => {
    const res = await API.get("/pdfs");
    setPdfs(res.data);
  };

  const addPdf = async (e) => {
    e.preventDefault();
    await API.post("/pdfs", { link });
    setLink("");
    fetchPdfs();
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Manage PDFs</h2>
      <form onSubmit={addPdf} className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Drive Link"
          className="border p-2 flex-1"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Add PDF
        </button>
      </form>
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf._id} className="mb-2">
            <a href={pdf.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              {pdf.link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PDFs;
