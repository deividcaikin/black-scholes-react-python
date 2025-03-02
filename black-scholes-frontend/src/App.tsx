import React, { useState, useEffect } from "react";
import axios from "axios";

const App: React.FC = () => {
    const [input, setInput] = useState({
        S: 100, K: 100, T: 1, r: 1, sigma: 5, q: 0
    });
    // S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, q: 0
    const [result, setResult] = useState<{ call_price: number, put_price: number } | null>(null);
    const [calculations, setCalculations] = useState<any[]>([]); // Stores previous calculations

    const MIN_VALUES : { [key in keyof typeof input]: number } = {
      S: 1, 
      K: 1, 
      T: 0, 
      r: 0, 
      sigma: 0, 
      q: 0
    };
  
    const MAX_VALUES : { [key in keyof typeof input]: number } =  {
        S: 10000, 
        K: 10000, 
        T: 5, 
        r: 10, 
        sigma: 100, 
        q: 20
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const key = name as keyof typeof input;

        let parsedValue = value === "" ? 0 : parseFloat(value);

        // Validate min and max values
        if (parsedValue < MIN_VALUES[key] || parsedValue > MAX_VALUES[key]) {
          alert(`${name} must be between ${MIN_VALUES[key]} and ${MAX_VALUES[key]}`);
          return; // Prevent updating state if value is out of bounds
      }


        setInput({ ...input, [name]: value === "" ? 0 : parseFloat(value) });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/calculate", input, {
                headers: { "Content-Type": "application/json", "accept": "application/json" }
            });
            setResult(response.data);
            fetchCalculations(); // Refresh previous calculations after submitting
        } catch (error) {
            console.error("Error calling API:", error);
        }
    };

    // ✅ Fetch previous calculations
    const fetchCalculations = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/calculations");
            setCalculations(response.data);
        } catch (error) {
            console.error("Error fetching calculations:", error);
        }
    };

    const handleSetPreviousInputs = (calc: any) => {
      setInput({
          S: calc.S,
          K: calc.K,
          T: calc.T,
          r: calc.r,
          sigma: calc.sigma,
          q: calc.q,
      });
  };

    useEffect(() => {
        fetchCalculations(); // Load data on page load
    }, []);

    return (
        <div style={{ textAlign: 'center', maxHeight: 'calc(100vh - 500px)'}}>
            <h2>Black-Scholes Calculator</h2>
            
            <table>
              <tr>
                <th style={{width: "50%"}}>

                </th>
                <th style={{width: "33%"}}>
                  <table>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Stock Price</label></td>
                            <td><input name="S" value={input.S} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Strike Price</label></td>
                            <td><input name="K" value={input.K} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Time to Expiration</label></td>
                            <td><input name="T" value={input.T} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Risk-Free Rate</label></td>
                            <td><input name="r" value={input.r} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Volatility</label></td>
                            <td><input name="sigma" value={input.sigma} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Dividend Yield</label></td>
                            <td><input name="q" value={input.q} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td colSpan={2}><button onClick={handleSubmit}>Calculate</button></td>
                        </tr>
                    </tbody>
                </table>



                </th>
                
              </tr>
              <tr>
              <th style={{width: "50%"}}>

              </th>
              <th style={{width: "33%"}}>
                  {result && (
                    <div>
                        <div>
                          <p style={{ textAlign: 'left'}}><b>Call Price:</b> {result.call_price.toFixed(2)}</p>
                          <p style={{ textAlign: 'left'}}><b>Put Price:</b>  {result.put_price.toFixed(2)}</p>
                        </div>
                    </div> 
                    )}

                </th>
              </tr>
              </table>
              <table style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', maxHeight: '100vh', textAlign: 'center' }}>  
                <tr>
                <th style={{width: "33%"}}>
                  <h2>Previous Calculations</h2>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', width: '100%' }}>
                        <table style={{border: 1, justifyContent: ""}}>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Date Created</th>
                              <th>Time Created</th>
                              <th>Stock Price (S)</th>
                              <th>Strike Price (K)</th>
                              <th>Time to Expiration (T)</th>
                              <th>Risk-Free Rate (r)</th>
                              <th>Volatility (σ)</th>
                              <th>Dividend Yield (q)</th>
                              <th>Call Price</th>
                              <th>Put Price</th>
                              
                            </tr>
                          </thead>
                          <tbody>
                            {calculations.map((calc, index) => (
                              <tr key={index}>
                                <td>{calc.id}</td>
                                <td>{ calc.date_created.split("T")[0]}</td>
                                <td>{ calc.date_created.split("T")[1].split(".")[0]}</td>
                                <td>{calc.S}</td>
                                <td>{calc.K}</td>
                                <td>{calc.T}</td>
                                <td>{calc.r}</td>
                                <td>{calc.sigma}</td>
                                <td>{calc.q}</td>
                                <td>{calc.call_price.toFixed(2)}</td>
                                <td>{calc.put_price.toFixed(2)}</td>
                                <td>
                                      <button onClick={() => handleSetPreviousInputs(calc)}>Set as Input</button>
                                  </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>  
                    </th>
                </tr>
              </table>  
                
        </div>
    );
};

export default App;
