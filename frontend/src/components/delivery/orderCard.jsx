import MapView from "./MapView";

const OrderCard = ({ order, onAccept, onDecline, driverLocation }) => {
  const restaurantCoords = order.restaurantLocation?.coordinates
    ?.slice()
    .reverse(); // [lat, lng]
  const driverCoords = driverLocation?.slice().reverse(); // [lat, lng]

  const markers = [
    { label: "Restaurant", coordinates: restaurantCoords },
    { label: "You", coordinates: driverCoords },
  ];

  return (
    <div className="order-card border p-3 mb-3 rounded shadow-sm">
      <h5>Order #{order._id.slice(-5)}</h5>
      <p>Total: Rs. {order.total}</p>
      <p>Status: {order.status}</p>
      {order.items.map((item, i) => (
        <p key={i}>
          {item.name} × {item.quantity}
        </p>
      ))}

      <MapView markers={markers} />

      <div className="mt-2">
        {onAccept && (
          <button
            className="btn btn-success me-2"
            onClick={() => onAccept(order._id)}
          >
            Accept
          </button>
        )}
        {onDecline && (
          <button
            className="btn btn-danger"
            onClick={() => onDecline(order._id)}
          >
            Decline
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
