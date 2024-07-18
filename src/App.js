import { useForm } from "react-hook-form";
import "./App.css";

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    fetch(
      "https://23a6-171-253-130-86.ngrok-free.app/api/webhook-integrations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        alert("Data inserted successfully");
        reset();
      })
      .catch((error) => alert("Insert failed"));
  };

  const onSendTest = (data) => {
    const { webhookUrl, botDisplayName, friendlyName } = data;

    const payload = {
      username: botDisplayName ?? "Example Bot",
      content: `This is a test message from ${friendlyName}`,
    };

    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          alert("Test message sent successfully!");
          reset();
        } else {
          throw new Error("Failed to send test message");
        }
      })
      .catch((error) => {
        alert("Failed to send test message");
      });
  };

  return (
    <div className="form-container">
      <h2>Add New Integration</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Type</label>
        <select {...register("type", { required: "Type is required" })}>
          <option value="">Select type</option>
          <option value="discord">
            <img src="./discord-icon.jpg" alt="Discord" className="icon" />
            Discord
          </option>
        </select>
        {errors.type && <span className="error">{errors.type.message}</span>}

        <label>
          Friendly Name <span className="required-label">*</span>
        </label>
        <input
          type="text"
          {...register("friendlyName", {
            required: "Friendly Name is required",
          })}
          placeholder="My Discord Alert (1)"
        />
        {errors.friendlyName && (
          <span className="error">{errors.friendlyName.message}</span>
        )}

        <label>
          Webhook URL <span className="required-label">*</span>
        </label>
        <input
          type="url"
          {...register("webhookUrl", { required: "Webhook URL is required" })}
          placeholder=""
        />
        {errors.webhookUrl && (
          <span className="error">{errors.webhookUrl.message}</span>
        )}

        <label>Bot Display Name</label>
        <input
          type="text"
          {...register("botDisplayName")}
          placeholder="BWatch"
        />

        <div className="form-actions">
          <button
            type="button"
            onClick={handleSubmit(onSendTest)}
            className="btn btn-secondary"
          >
            Send Test
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
