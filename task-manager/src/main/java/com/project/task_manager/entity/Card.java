package com.project.task_manager.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cards")
public class Card {
    @Id
    private String id;
    private String title;
    private String description;
    private String column;  // e.g., "To Do", "In Progress", "Done"
    private int order;      // position in column
    private String userId;  // NEW: stores the user identifier (e.g., username or user id)

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColumn() { return column; }
    public void setColumn(String column) { this.column = column; }

    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
