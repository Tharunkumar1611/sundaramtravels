package com.examly.springapp.service;

import com.examly.springapp.model.Expense;
import com.examly.springapp.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Long id, Expense expenseDetails) {
        Expense existingExpense = expenseRepository.findById(id).orElse(null);
        if (existingExpense == null) {
            return null;
        }
        existingExpense.setCategory(expenseDetails.getCategory());
        existingExpense.setAmount(expenseDetails.getAmount());
        existingExpense.setCurrency(expenseDetails.getCurrency());
        existingExpense.setDate(expenseDetails.getDate());
        existingExpense.setDescription(expenseDetails.getDescription());
        existingExpense.setPaymentMethod(expenseDetails.getPaymentMethod());
        existingExpense.setItinerary(expenseDetails.getItinerary());
        return expenseRepository.save(existingExpense);
    }

    public Page<Expense> getPaginatedExpenses(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return expenseRepository.findAll(pageable);
    }
}
