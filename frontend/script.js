const API_BASE = "http://localhost:8080/api/employees";

// ===== DOM references =====
const ledgerBody = document.getElementById("ledgerBody");
const ledgerTable = document.getElementById("ledgerTable");
const emptyState = document.getElementById("emptyState");
const errorState = document.getElementById("errorState");
const errorDetail = document.getElementById("errorDetail");
const apiDot = document.getElementById("apiDot");
const apiStatusText = document.getElementById("apiStatusText");
const empCount = document.getElementById("empCount");
const deptCount = document.getElementById("deptCount");

const overlay = document.getElementById("overlay");
const panel = document.getElementById("panel");
const panelTitle = document.getElementById("panelTitle");
const employeeForm = document.getElementById("employeeForm");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");

const employeeIdInput = document.getElementById("employeeId");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const departmentInput = document.getElementById("departmentInput");
const salaryInput = document.getElementById("salaryInput");
const joiningDateInput = document.getElementById("joiningDateInput");

const toast = document.getElementById("toast");

let currentEmployees = [];

// ===== Helpers =====
function showToast(message, isError = false) {
  toast.textContent = message;
  toast.className = "toast" + (isError ? " error" : "");
  toast.hidden = false;
  setTimeout(() => { toast.hidden = true; }, 3200);
}

function formatMoney(value) {
  if (value === null || value === undefined) return "—";
  return "₹" + Number(value).toLocaleString("en-IN");
}

function deptHueClass(deptName) {
  const hues = ["hue-1", "hue-2", "hue-3", "hue-4"];
  let sum = 0;
  for (const ch of deptName || "") sum += ch.charCodeAt(0);
  return hues[sum % hues.length];
}

function openPanel(mode, employee) {
  formError.hidden = true;
  employeeForm.reset();

  if (mode === "edit" && employee) {
    panelTitle.textContent = "Edit Entry";
    submitBtn.textContent = "Update entry";
    employeeIdInput.value = employee.id;
    nameInput.value = employee.name;
    emailInput.value = employee.email;
    departmentInput.value = employee.department;
    salaryInput.value = employee.salary;
    joiningDateInput.value = employee.joiningDate;
  } else {
    panelTitle.textContent = "New Entry";
    submitBtn.textContent = "Save entry";
    employeeIdInput.value = "";
  }

  overlay.hidden = false;
  panel.hidden = false;
}

function closePanel() {
  overlay.hidden = true;
  panel.hidden = true;
}

// ===== Rendering =====
function renderEmployees(employees) {
  currentEmployees = employees;
  ledgerBody.innerHTML = "";

  if (!employees.length) {
    ledgerTable.hidden = true;
    emptyState.hidden = false;
    errorState.hidden = true;
    updateCounts([]);
    return;
  }

  emptyState.hidden = true;
  errorState.hidden = true;
  ledgerTable.hidden = false;

  for (const emp of employees) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="row-id">#${String(emp.id).padStart(3, "0")}</td>
      <td class="row-name">${escapeHtml(emp.name)}</td>
      <td class="row-email">${escapeHtml(emp.email)}</td>
      <td><span class="dept-tag ${deptHueClass(emp.department)}">${escapeHtml(emp.department)}</span></td>
      <td class="row-salary">${formatMoney(emp.salary)}</td>
      <td class="mono">${emp.joiningDate || "—"}</td>
      <td class="col-actions">
        <button class="btn-edit-text" data-action="edit" data-id="${emp.id}">Edit</button>
        <button class="btn-danger-text" data-action="delete" data-id="${emp.id}">Delete</button>
      </td>
    `;
    ledgerBody.appendChild(tr);
  }

  updateCounts(employees);
}

function updateCounts(employees) {
  empCount.textContent = employees.length;
  const depts = new Set(employees.map(e => e.department));
  deptCount.textContent = depts.size;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setApiStatus(ok) {
  apiDot.className = "dot " + (ok ? "ok" : "bad");
  apiStatusText.textContent = ok ? "API connected" : "API unreachable";
}

// ===== API calls =====
async function fetchEmployees(params = {}) {
  try {
    let url;
    if (params.department) {
      url = `${API_BASE}/department/${encodeURIComponent(params.department)}`;
    } else if (params.minSalary || params.maxSalary) {
      const min = params.minSalary || "0";
      const max = params.maxSalary || "999999999";
      url = `${API_BASE}/search?minSalary=${min}&maxSalary=${max}`;
    } else {
      url = `${API_BASE}?size=100`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const data = await res.json();

    // Paginated endpoint returns { content: [...] }, others return a plain array
    const list = Array.isArray(data) ? data : (data.content || []);
    setApiStatus(true);
    renderEmployees(list);
  } catch (err) {
    setApiStatus(false);
    ledgerTable.hidden = true;
    emptyState.hidden = true;
    errorState.hidden = false;
    errorDetail.textContent = "Make sure the Spring Boot app is running on localhost:8080. (" + err.message + ")";
  }
}

async function createEmployee(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res;
}

async function updateEmployee(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res;
}

async function deleteEmployee(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  return res;
}

// ===== Event wiring =====
document.getElementById("openAddBtn").addEventListener("click", () => openPanel("add"));
document.getElementById("cancelBtn").addEventListener("click", closePanel);
document.getElementById("closePanelBtn").addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);

document.getElementById("searchBtn").addEventListener("click", () => {
  const department = document.getElementById("deptFilter").value.trim();
  const minSalary = document.getElementById("minSalary").value.trim();
  const maxSalary = document.getElementById("maxSalary").value.trim();
  fetchEmployees({ department, minSalary, maxSalary });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("deptFilter").value = "";
  document.getElementById("minSalary").value = "";
  document.getElementById("maxSalary").value = "";
  fetchEmployees();
});

ledgerBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "edit") {
    const emp = currentEmployees.find(x => String(x.id) === id);
    if (emp) openPanel("edit", emp);
  }

  if (action === "delete") {
    if (!confirm("Delete this employee record? This can't be undone.")) return;
    const res = await deleteEmployee(id);
    if (res.status === 204) {
      showToast("Employee deleted");
      fetchEmployees();
    } else {
      showToast("Couldn't delete — check the backend console", true);
    }
  }
});

employeeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.hidden = true;

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    department: departmentInput.value.trim(),
    salary: parseFloat(salaryInput.value),
    joiningDate: joiningDateInput.value,
  };

  const id = employeeIdInput.value;
  submitBtn.disabled = true;

  try {
    const res = id ? await updateEmployee(id, payload) : await createEmployee(payload);

    if (res.status === 201 || res.status === 200) {
      showToast(id ? "Employee updated" : "Employee added");
      closePanel();
      fetchEmployees();
    } else {
      const body = await res.json().catch(() => ({}));
      const message = body.message
        || (body.fieldErrors && Object.values(body.fieldErrors).join(", "))
        || `Request failed with status ${res.status}`;
      formError.textContent = message;
      formError.hidden = false;
    }
  } catch (err) {
    formError.textContent = "Couldn't reach the API — is the backend running?";
    formError.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
});

// ===== 3D tilt on the ledger surface (subtle, follows cursor) =====
(function enableTilt() {
  const surface = document.getElementById("ledgerSurface");
  if (!surface) return;
  const MAX_TILT = 1.5; // subtle on purpose — this holds a data table, not a hero card

  surface.addEventListener("mousemove", (e) => {
    const rect = surface.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * MAX_TILT * 2;
    const rotateX = (0.5 - y) * MAX_TILT * 2;
    surface.style.transform = `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  surface.addEventListener("mouseleave", () => {
    surface.style.transform = "perspective(1600px) rotateX(0deg) rotateY(0deg)";
  });
})();

// ===== Init =====
fetchEmployees();
