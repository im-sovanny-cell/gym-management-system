import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createPayroll } from "../../api/payrollApi";

export default function PayrollCreate() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    trainerId: "",
    monthYear: "",
    totalHours: "",
    paidStatus: "unpaid"
  });

  const change = (k,v)=> setForm({...form,[k]:v});

  const save = async () => {
    try{
      await createPayroll(form);
      Swal.fire("Success","Payroll created!","success");
      nav("/payrolls");
    }catch(e){
      Swal.fire("Error", e.message || "Create failed","error");
    }
  };

  return(
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Payroll</h2>

      <div className="space-y-4">

        <input className="border p-2 w-full"
          placeholder="Trainer ID"
          value={form.trainerId}
          onChange={e=>change("trainerId",e.target.value)}
        />

        <input className="border p-2 w-full"
          placeholder="Month-Year (Nov-2025)"
          value={form.monthYear}
          onChange={e=>change("monthYear",e.target.value)}
        />

        <input className="border p-2 w-full"
          placeholder="Total Hours"
          value={form.totalHours}
          onChange={e=>change("totalHours",e.target.value)}
        />

        <select className="border p-2 w-full"
          value={form.paidStatus}
          onChange={e=>change("paidStatus",e.target.value)}
        >
          <option value="unpaid">unpaid</option>
          <option value="paid">paid</option>
        </select>

        <button
          onClick={save}
          className="bg-blue-600 text-white px-6 py-3 rounded font-semibold w-full"
        >
          Save
        </button>

        <button className="text-gray-500 underline" onClick={()=>nav("/payrolls")}>
          Back
        </button>
      </div>
    </div>
  )
}
