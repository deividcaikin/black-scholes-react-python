import React, { useState, useEffect } from "react";
import axios from "axios";

const App: React.FC = () => {
    const [input, setInput] = useState({
      stock_price: 100, strike_price: 100, time_expiration: 1, risk_free_rate: 1, volatility: 5, dividend_yield: 0
    });
    // S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, q: 0
    const [result, setResult] = useState<{ call_price: number, put_price: number } | null>(null);
    const [calculations, setCalculations] = useState<any[]>([]); // Stores previous calculations

    const MIN_VALUES : { [key in keyof typeof input]: number } = {
      stock_price: 1, 
      strike_price: 1, 
      time_expiration: 0, 
      risk_free_rate: 0, 
      volatility: 0, 
      dividend_yield: 0
    };
  
    const MAX_VALUES : { [key in keyof typeof input]: number } =  {
      stock_price: 10000, 
      strike_price: 10000, 
      time_expiration: 5, 
      risk_free_rate: 10, 
      volatility: 100, 
      dividend_yield: 20
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
          stock_price: calc.stock_price,
          strike_price: calc.strike_price,
          time_expiration: calc.time_expiration,
          risk_free_rate: calc.risk_free_rate,
          volatility: calc.volatility,
          dividend_yield: calc.dividend_yield,
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
                            <td><input name="stock_price" value={input.stock_price} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Strike Price</label></td>
                            <td><input name="strike_price" value={input.strike_price} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Time to Expiration</label></td>
                            <td><input name="time_expiration" value={input.time_expiration} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Risk-Free Rate</label></td>
                            <td><input name="risk_free_rate" value={input.risk_free_rate} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Volatility</label></td>
                            <td><input name="volatility" value={input.volatility} onChange={handleChange} type="number" inputMode="decimal"/></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left'}}><label>Dividend Yield</label></td>
                            <td><input name="dividend_yield" value={input.dividend_yield} onChange={handleChange} type="number" inputMode="decimal"/></td>
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
              <table style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', maxHeight: '100vh', textAlign: 'center' }}>  
                <tr>
                <th style={{width: "33%"}}>
                  <h2>Previous Calculations</h2>
                    <div style={{  maxHeight: '300px', overflowY: 'auto', width: '100%' }}>
                        <table style={{borderCollapse: "collapse", justifyContent: ""}}>
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid black"}}>ID</th>
                              <th style={{ border: "1px solid black"}}>Date Created</th>
                              <th style={{ border: "1px solid black"}}>Time Created</th>
                              <th style={{ border: "1px solid black"}}>Stock Price (S)</th>
                              <th style={{ border: "1px solid black"}}>Strike Price (K)</th>
                              <th style={{ border: "1px solid black"}}>Time to Expiration (T)</th>
                              <th style={{ border: "1px solid black"}}>Risk-Free Rate (r)</th>
                              <th style={{ border: "1px solid black"}}>Volatility (σ)</th>
                              <th style={{ border: "1px solid black"}}>Dividend Yield (q)</th>
                              <th style={{ border: "1px solid black"}}>Call Price</th>
                              <th style={{ border: "1px solid black"}}>Put Price</th>
                              
                            </tr>
                          </thead>
                          <tbody>
                            {calculations.map((calc, index) => (
                              <tr key={index}>
                                <td style={{ border: "1px solid black"}}>{calc.id}</td>
                                <td style={{ border: "1px solid black"}}>{ calc.date_created.split("T")[0]}</td>
                                <td style={{ border: "1px solid black"}}>{ calc.date_created.split("T")[1].split(".")[0]}</td>
                                <td style={{ border: "1px solid black"}}>{calc.stock_price}</td>
                                <td style={{ border: "1px solid black"}}>{calc.strike_price}</td>
                                <td style={{ border: "1px solid black"}}>{calc.time_expiration}</td>
                                <td style={{ border: "1px solid black"}}>{calc.risk_free_rate}</td>
                                <td style={{ border: "1px solid black"}}>{calc.volatility}</td>
                                <td style={{ border: "1px solid black"}}>{calc.dividend_yield}</td>
                                <td style={{ border: "1px solid black"}}>{calc.call_price.toFixed(2)}</td>
                                <td style={{ border: "1px solid black"}}>{calc.put_price.toFixed(2)}</td>
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
