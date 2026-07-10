package com.neha.employeemanagement.repository;

import com.neha.employeemanagement.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Search by department (used by GET /api/employees/department/{department})
    List<Employee> findByDepartmentIgnoreCase(String department);

    // Search by salary range (used by GET /api/employees/search?minSalary=&maxSalary=)
    List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary);

    // Paginated list of all employees (used by GET /api/employees?page=&size=)
    Page<Employee> findAll(Pageable pageable);

    boolean existsByEmail(String email);
}
