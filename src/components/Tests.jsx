import React, { useEffect, useState } from "react";
import API from "../utils/api";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTests = async () => {
    const res = await API.get("/tests");
    setTests(res.data);
  };

  const addTest = async (e) => {
    e.preventDefault();
    await API.post("/tests", { title });
    setTitle("");
    fetchTests();
  };

  const addQuestion = async (id) => {
    const q = prompt("Enter Question");
    const a = prompt("Enter Answer");
    if (q && a) {
      await API.post(`/tests/${id}/questions`, { question: q, answer: a });
      fetchTests();
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Manage Tests</h2>
      <form onSubmit={addTest} className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Test Title"
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button className="bg-purple-500 text-white px-4 py-2 rounded">
          Add Test
        </button>
      </form>
      <ul>
        {tests.map((test) => (
          <li key={test._id} className="mb-4">
            <h3 className="font-bold">{test.title}</h3>
            <button
              onClick={() => addQuestion(test._id)}
              className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
            >
              Add Question
            </button>
            <ul className="ml-4 mt-2 list-disc">
              {test.questions.map((q, i) => (
                <li key={i}>
                  {q.question} — <span className="text-green-600">{q.answer}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tests;
