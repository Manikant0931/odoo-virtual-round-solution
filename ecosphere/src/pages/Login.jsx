import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEsg } from "../context/EsgContext";
import { employees } from "../data/mockData";
import { Card, Button, Field } from "../components/ui";

export default function Login() {
  const { state, login } = useEsg();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");

  if (state.auth?.userId) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!employeeId) return;
    login(employeeId);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-paper-50 px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-md">
        <Card className="p-8">
          <div className="space-y-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-ink-600">EcoSphere demo login</p>
              <h1 className="mt-3 text-3xl font-semibold text-ink-900">Sign in to continue</h1>
              <p className="mt-2 text-sm text-ink-700">Choose your employee account to access the ESG demo workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Employee account">
                <select
                  value={employeeId}
                  onChange={(event) => setEmployeeId(event.target.value)}
                  className="w-full rounded-lg border border-ink-900/15 bg-paper-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>

            <div className="rounded-xl bg-ink-900/5 p-4 text-sm text-ink-700">
              <p className="font-medium text-ink-900">Demo note</p>
              <p>Select any employee to enter the application. The session is stored only in memory.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
