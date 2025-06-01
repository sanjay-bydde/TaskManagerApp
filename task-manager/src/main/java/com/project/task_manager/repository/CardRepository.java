package com.project.task_manager.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.task_manager.entity.Card;

public interface CardRepository extends MongoRepository<Card, String> {
    List<Card> findByColumnOrderByOrder(String column);
    List<Card> findByUserId(String userId);
}