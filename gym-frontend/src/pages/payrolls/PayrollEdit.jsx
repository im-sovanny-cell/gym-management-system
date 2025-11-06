import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getPayrollById, updatePayroll } from "../../api/payrollApi";

export default function PayrollEdit(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form,setForm]=useState(null);

  useEffect(()=>{load();},[]);

  const load = async() => {
    try{
      const data = await getPayrollById(id);
      setForm(data);
    }catch(e){
      Swal.fire("Error","Load failed","error");
    }
  }

  const change = (k,v)=> setForm({...form,[k]:v});

  const save = async() => {
    try{
      await updatePayroll(id, form);
      Swal.fire("Success","Payroll updated!","success");
      nav("/payrolls");
    }catch(e){
      Swal.fire("Error","Update failed","error");
    }
  }

  if(!form) return <div className="p-6">Loading...</div>;

  return(
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Payroll</h2>

      <div className="space-y-4">
        <input className="border p-2 w-full"
          value={form.trainerId} disabled
        />

        <input className="border p-2 w-full"
          value={form.monthYear}
          onChange={e=>change("monthYear",e.target.value)}
        />

        <input className="border p-2 w-full"
          value={form.totalHours}
          onChange={e=>change("totalHours",e.target.value)}
        />

        <input className="border p-2 w-full" disabled
          value={form.totalPay}
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
          className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold w-full"
        >
          Update
        </button>

        <button className="text-gray-500 underline" onClick={()=>nav("/payrolls")}>
          Back
        </button>
      </div>
    </div>
  )
}
