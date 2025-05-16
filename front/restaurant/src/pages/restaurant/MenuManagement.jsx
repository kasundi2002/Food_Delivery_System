import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";


// API base URL
const API_URL = "http://localhost:3002/api/products";

const MenuManagement = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    category: "main",
    url: "",
    restaurantId: "6816238bdf3ff8b66ac78ad4",
  });

  // Fetch menu items from backend when component mounts
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  // Filter menu items based on category
  const filteredItems = menuItems.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  // Handle edit dialog open
  const handleEditClick = (item) => {
    setEditItem({ ...item });
    setShowEditDialog(true);
  };

  // Handle change in edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  // Save edited item to backend
  const handleEditSave = async () => {
    try {
      const response = await fetch(`${API_URL}/${editItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editItem),
      });
      if (response.ok) {
        fetchMenuItems();
        setShowEditDialog(false);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Handle add item form change
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  // Save new item to backend
  const handleAddSave = async (e) => {
    e.preventDefault(); // Prevent form submission
    console.log("Add Item button clicked");
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        console.log("Item added successfully");
        fetchMenuItems();
        setShowAddDialog(false);
      } else {
        console.error("Failed to add item:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  
  
  

  // Handle delete item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f5f6fa" }}
    >
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ fontSize: "1.6rem", color: "#2c3e50" }}>
            Menu Management
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "3rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            {["all","main",  "appetizers", "desserts", "beverages"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    backgroundColor:
                      activeCategory === cat ? "#e74c3c" : "transparent",
                    color: activeCategory === cat ? "#fff" : "#333",
                    border: `1px solid ${
                      activeCategory === cat ? "#e74c3c" : "#ccc"
                    }`,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            style={{
              backgroundColor: "#2ecc71",
              color: "white",
              marginBottom: "2rem",
              fontSize: "1rem",
              padding: "0.5rem 1.3rem",
              borderRadius: "120px",
              border: "none",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
          >
            Add Item
          </button>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {filteredItems.filter((val)=>{
            if(val.restaurantId == "6816238bdf3ff8b66ac78ad4"){
              return val
            }


          }).map((item) => (
            <div
              key={item?.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              {item?.url && (
                <img
                  src={item?.url}
                  alt={item?.name}
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    height: "auto",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  fontSize: "1rem",
                }}
              >
                <span style={{ fontWeight: 600, color: "#2c3e50" }}>
                  {item?.name}
                </span>
                 {/* Category label */}
    <span
      style={{
        
        top: "1rem",
        right: "1rem",
        backgroundColor: "#ecf0f1",
        color: "#7f8c8d",
        padding: "0.3rem 0.8rem",
        borderRadius: "20px",
        fontSize: "0.75rem",
        textTransform: "capitalize",
      }}
    >
      {item?.category}
    </span>
              </div>
              <p style={{ color: "#555", margin: "0.5rem 0" }}>
                {item?.description}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#2ecc71",
                  }}
                >
                  ${item?.price.toFixed(2)}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEditClick(item)}
                    style={{
                      padding: "0.4rem 0.9rem",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      padding: "0.4rem 0.9rem",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showEditDialog && editItem && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
            onClick={() => setShowEditDialog(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                padding: "4rem",
                borderRadius: "16px",
                width: "450px",
                maxWidth: "95%",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              {/* Edit Form */}
              {["name", "description", "price", "category", "url"].map(
                (field) => (
                  <div key={field} style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        marginBottom: "0.5rem",
                        display: "block",
                      }}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field === "description" ? (
                      <textarea
                        name={field}
                        value={editItem[field]}
                        onChange={handleEditChange}
                        style={{
                          width: "100%",
                          padding: "0.8rem 1rem",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          resize: "vertical",
                        }}
                      />
                    ) : (
                      <input
                        name={field}
                        type={field === "price" ? "number" : "text"}
                        value={editItem[field]}
                        onChange={handleEditChange}
                        style={{
                          width: "100%",
                          padding: "0.7rem 1rem",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                        }}
                      />
                    )}
                  </div>
                )
              )}
              {editItem.url && (
                <img
                  src={editItem.url}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    height: "auto",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                }}
              >
                <button
                  onClick={handleEditSave}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    backgroundColor: "#3498db",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEditDialog(false)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    backgroundColor: "#95a5a6",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Dialog */}
        {showAddDialog && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
            onClick={() => setShowAddDialog(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                padding: "4rem",
                borderRadius: "16px",
                width: "450px",
                maxWidth: "95%",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              {/* Add Form */}
              {["name", "description", "price", "category", "url"].map(
                (field) => (
                  <div key={field} style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        marginBottom: "0.5rem",
                        display: "block",
                      }}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field === "description" ? (
                      <textarea
                        name={field}
                        value={newItem[field]}
                        onChange={handleAddChange}
                        style={{
                          width: "100%",
                          padding: "0.8rem 1rem",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          resize: "vertical",
                        }}
                      />
                    ) : (
                      <input
                        name={field}
                        type={field === "price" ? "number" : "text"}
                        value={newItem[field]}
                        onChange={handleAddChange}
                        style={{
                          width: "100%",
                          padding: "0.7rem 1rem",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                        }}
                      />
                    )}
                  </div>
                )
              )}
              {newItem.url && (
                <img
                  src={newItem.url}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    height: "auto",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                }}
              >
                <button
                  onClick={handleAddSave}
                  style={{
                    type: "button",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    backgroundColor: "#3498db",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Add Item
                </button>

                <button
                  onClick={() => setShowAddDialog(false)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    backgroundColor: "#95a5a6",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
