function App() {
  return (
    <div>
        <WeatherInfo location = "London" />
        <Notes />
    </div>
  );
}


function WeatherInfo({ location, }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        async function fetchWeather() {
            const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=0&current_weather=true");
            if (response.status === 200) {
                const json = await response.json();
                setData(json);
                setIsLoading(false);
            }
        }
        fetchWeather();

    }, []);

  return (
    <div style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
        <h3>
            Погода в {location}
        </h3>
        { isLoading? <p>Загрузка...</p> : <p>Температура {data.current_weather.temperature}</p> }
    </div>
  );
}


function Notes() {
    const [notes, setNotes] = React.useState([
        "Купить хлеб",
        "Позвонить другу",
        "Выучить React"
    ]);

    const [inputValue, setInputValue] = React.useState("");

    function addNote() {
        if (inputValue.trim() === "") return;
        setNotes([...notes, inputValue.trim()]);
        setInputValue("");
    }

    function deleteNote(indexToRemove) {
        setNotes(notes.filter((_, index) => index !== indexToRemove));
    }

    return (
        <div style={{ padding: "1rem", maxWidth: "400px", border: "1px solid #ccc" }}>
            <h3>📝 Заметки</h3>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Новая заметка"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button onClick={addNote}>Добавить</button>
            </div>

            <ul>
                {notes.map((note, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>
                        {note}
                        <button
                            onClick={() => deleteNote(index)}
                            style={{
                                marginLeft: "1rem",
                                color: "white",
                                backgroundColor: "red",
                                border: "none",
                                padding: "2px 6px",
                                cursor: "pointer"
                            }}
                        >
                            ✖
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);



