import { Circles } from "react-loader-spinner";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <Circles height="60" width="60" color="#0d6efd" />
      <p style={{ color: "#555" }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
