package com.neha.employeemanagement.service;

import com.neha.employeemanagement.exception.DuplicateResourceException;
import com.neha.employeemanagement.exception.ResourceNotFoundException;
import com.neha.employeemanagement.model.Employee;
import com.neha.employeemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // CREATE
    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new DuplicateResourceException(
                    "An employee with email '" + employee.getEmail() + "' already exists");
        }
        return employeeRepository.save(employee);
    }

    // READ - single employee
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    // READ - all employees (paginated)
    public Page<Employee> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }

    // READ - by department
    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartmentIgnoreCase(department);
    }

    // READ - by salary range
    public List<Employee> getEmployeesBySalaryRange(Double minSalary, Double maxSalary) {
        return employeeRepository.findBySalaryBetween(minSalary, maxSalary);
    }

    // UPDATE
    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        Employee existing = getEmployeeById(id);

        // If email is being changed, make sure the new one isn't already taken
        if (!existing.getEmail().equalsIgnoreCase(updatedEmployee.getEmail())
                && employeeRepository.existsByEmail(updatedEmployee.getEmail())) {
            throw new DuplicateResourceException(
                    "An employee with email '" + updatedEmployee.getEmail() + "' already exists");
        }

        existing.setName(updatedEmployee.getName());
        existing.setEmail(updatedEmployee.getEmail());
        existing.setDepartment(updatedEmployee.getDepartment());
        existing.setSalary(updatedEmployee.getSalary());
        existing.setJoiningDate(updatedEmployee.getJoiningDate());

        return employeeRepository.save(existing);
    }

    // DELETE
    public void deleteEmployee(Long id) {
        Employee existing = getEmployeeById(id);
        employeeRepository.delete(existing);
    }
}
