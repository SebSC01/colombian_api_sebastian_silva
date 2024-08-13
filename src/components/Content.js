import React, { useState, useEffect } from 'react';
import './Content.css'; //Llamado al archivo de estilos


function App() {
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [data, setData] = useState(null);
    const [responseTime, setResponseTime] = useState(null); //Constante que alamcena el tiempo de respuesta de la API

    const handleButtonClick = (category) => {
        setSelectedCategory(category);
        setData(null);
        setResponseTime(null);
    };

    useEffect(() => {
        if (selectedCategory) {
        const apiUrl = getApiUrl(selectedCategory); //Define la URL de la api

        // Inicia el temporizador
        const startTime = Date.now();

        // Llamada a la API
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const endTime = Date.now();
                const timeTaken = endTime - startTime; // Calcula el tiempo de respuesta
                setResponseTime(timeTaken); // Almacena el tiempo de respuesta en el estado

                if (selectedCategory === 'presidents') {
                    const groupedData = groupAndSortPresidentsByParty(data);
                    setData(groupedData);
                } else {
                    setData(data);
                }
            })
            .catch((error) => console.error('Error al obtener datos:', error));
        }
    }, [selectedCategory]);

    //Categorias y selección de información
    const getApiUrl = (category) => {
        switch (category) {
        case 'presidents':
            return 'https://api-colombia.com/api/v1/President'; //Sección de presidentes
        case 'airports':
            return 'https://api-colombia.com/api/v1/Airport'; //Sección de aeropuertos
        case 'TouristicAttraction':
            return 'https://api-colombia.com/api/v1/TouristicAttraction'; //Sección de atracciones turisticas
            case 'airportsRegion':
                return 'https://api-colombia.com/api/v1/Airport'; //Sección de aeropuertos
        default:
            return '';
        }
    };

    //Visualización de los datos de cada sección
const renderVisualization = () => {
        if (!data) return <p>Selecciona uno de los items</p>;

        switch (selectedCategory) {
            case 'presidents':
                return <PresidentsVisualization data={data} responseTime={responseTime} />;
            case 'TouristicAttraction':
                return <TouristicAttractionVisualization data={data} responseTime={responseTime} />;
            case 'airports':
                return <AirportsVisualization data={data} responseTime={responseTime} />;
            case 'airportsRegion':
                return <AirportsRegionVisualization data={data} responseTime={responseTime} />;
            case 'airportsRegion':
                return <AirportVisualization data={data} responseTime={responseTime} />;
            default:
                return <p>Seleccione una categoría para ver la visualización.</p>;
        }
    };

    return ( //Botones para visualizar
        <div className="App">
        <ul className="button-list">
            <li><button onClick={() => handleButtonClick('presidents')}>Partidos Politicos</button></li>
            <li><button onClick={() => handleButtonClick('TouristicAttraction')}>Atracciones Turisticas</button></li>
            <li><button onClick={() => handleButtonClick('airports')}>Aeropuertos</button></li>
            <li><button onClick={() => handleButtonClick('airportsRegion')}>Aeropuertos por Región</button></li>
        </ul>

        <div className="visualization">
            {renderVisualization()}
        </div>
        </div>
    );
    }

    //Contador de registros
    function countRecords(data) {
        return data.length;
    }
    
    // Variable para almacenar la petición de los partidos politicos
    const groupAndSortPresidentsByParty = (presidents) => {
        const partyCounts = presidents.reduce((acc, president) => {
        const politicalParty = president.politicalParty;
        if (politicalParty in acc) { //Contador de presidentes por partido politico
            acc[politicalParty]++;
        } else {
            acc[politicalParty] = 1;
        }
        return acc;
        }, {});
    
        const sortedParties = Object.entries(partyCounts)
        .map(([politicalParty, count]) => ({ politicalParty, count }))
        .sort((a, b) => b.count - a.count);
    
        return sortedParties;
    };

    function PresidentsVisualization({ data, responseTime }) {  //Visualización de la tabla
        const recordCount = countRecords(data);
    return (
        <div className='list_president'>
        <h2 className='title'>Partidos politicos de Colombia</h2>
        <h2>Partidos Políticos (Total: {recordCount})</h2>
        <div>Tiempo de respuesta: {responseTime} ms</div> {/* Muestra el tiempo de respuesta */}
        <div id="response-time"></div>

        <table>
            <thead>
                <tr>
                    <th scope='col'>Partido politico</th>
                    <th scope='col'>Presidentes</th>
                </tr>
            </thead>
            <tbody>
            {data.map((politicalParty, index) => (
            <tr key={index}>
                <td scope = 'row'>{politicalParty.politicalParty}</td>
                <td>{politicalParty.count} Presidentes</td>
            </tr>
            ))}
        </tbody>
        </table>
        </div>
    );
    }

    function TouristicAttractionVisualization({ data, responseTime }) {  //Visualización de la tabla de atracciones turisticas
        const groupedData = groupAttractionsByDepartmentAndCity(data);
        const recordCount = countRecords(data);
    
        return (
            <div>
                <h2>Atracciones Turísticas por Departamento y Ciudad</h2>
                <h2>Atracciones Turísticas (Total: {recordCount})</h2>
                <div>Tiempo de respuesta: {responseTime} ms</div> {/* Muestra el tiempo de respuesta */}
                <table>
                    <thead>
                        <tr>
                            <th scope='col'>Ciudad</th>
                            <th scope='col'>Cantidad de atracciones Turisticas</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Object.keys(groupedData).map((department, index) => (
                            Object.keys(groupedData[department]).map((city, index) => (
                                <tr key={index}>
                                    <td scope = 'row'>{city}</td>
                                    <td>{groupedData[department][city]}</td>
                                </tr>
                            ))
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
    
    function groupAttractionsByDepartmentAndCity(attractions) { //Contador de atracciones por ciudad
        const grouped = attractions.reduce((acc, attraction) => {
            const department = attraction.city.department;
            const city = attraction.city.name;
    
            if (!acc[department]) {
                acc[department] = {};
            }
    
            if (!acc[department][city]) {
                acc[department][city] = 0;
            }
    
            acc[department][city]++;
            return acc;
        }, {});
    
        return grouped;
    }
    
    

    function AirportsVisualization({ data, responseTime }) { //Visualización de aeropuertos por ciudad
        const groupedData = groupAirportsByDepartmentAndCity(data);
        const recordCount = countRecords(data);
    
        return (
            <div>
                <h2>Aeropuertos por Departamento y Ciudad</h2>
                <h2>Aeropuertos (Total: {recordCount})</h2>
                <div>Tiempo de respuesta: {responseTime} ms</div> {/* Muestra el tiempo de respuesta */}
                <table>
                    <thead>
                        <tr>
                            <th scope='col'>Ciudad</th>
                            <th scope='col'>Departamento</th>
                            <th scope='col'>Cantidad de Aeropuertos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedData).map((department, depIndex) =>
                            Object.keys(groupedData[department]).map((city, cityIndex) => (
                                <tr key={`${depIndex}-${cityIndex}`}>
                                    <td scope='row'>{city}</td>
                                    <td>{department}</td>
                                    <td>{groupedData[department][city].length}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
    
    
    function groupAirportsByDepartmentAndCity(airports) { //Contador de aeropuertos por ciudad
        const grouped = airports.reduce((acc, airport) => {
            // Accede al nombre del departamento
            const department = airport.department?.name || "Sin departamento";
            // Accede al nombre de la ciudad
            const city = airport.city?.name || "Sin ciudad";
    
            if (!acc[department]) {
                acc[department] = {};
            }
    
            if (!acc[department][city]) {
                acc[department][city] = [];
            }
    
            acc[department][city].push(airport);
            return acc;
        }, {});
    
        return grouped;
    }

    function groupAirportsByRegionDepartmentCityType(airportData) { //Registro de cada aeropuerto por región
        const groupedAirports = {};
    
        airportData.forEach(airportsRegion => { //Validaciones de registros
            const regionName = airportsRegion.department.region?.name || 'Sin Región';
            const departmentName = airportsRegion.department.name || 'Sin Departamento';
            const cityName = airportsRegion.city.name || 'Sin Ciudad';
            const airportType = airportsRegion.type || 'Sin Tipo';
            
            // División de registro para el formato establecido por la prueba
            if (!groupedAirports[regionName]) {
                groupedAirports[regionName] = {};
            }
    
            if (!groupedAirports[regionName][departmentName]) {
                groupedAirports[regionName][departmentName] = {};
            }
    
            if (!groupedAirports[regionName][departmentName][cityName]) {
                groupedAirports[regionName][departmentName][cityName] = {};
            }
    
            if (!groupedAirports[regionName][departmentName][cityName][airportType]) {
                groupedAirports[regionName][departmentName][cityName][airportType] = [];
            }
    
            groupedAirports[regionName][departmentName][cityName][airportType].push(airportsRegion.name);
        });
    
        return groupedAirports;
    }
    
    function AirportsRegionVisualization({ data, responseTime  }) { //Visualización de aeropuertos por Región
        const groupedAirports = groupAirportsByRegionDepartmentCityType(data);
        const recordCount = countRecords(data);
        return (
            <div>
                <h2>Aeropuertos por Región, Departamento, Ciudad y Tipo</h2>
                <h2>Aeropuertos por Región (Total: {recordCount})</h2>
                <div>Tiempo de respuesta: {responseTime} ms</div> {/* Muestra el tiempo de respuesta */}
                <table>
                    <thead>
                        <tr>
                            <th scope='col'>Región</th>
                            <th scope='col'>Departamento</th>
                            <th scope='col'>Ciudad</th>
                            <th scope='col'>Tipo</th>
                            <th scope='col'>Cantidad de Aeropuertos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedAirports).map((region, regIndex) =>
                            Object.keys(groupedAirports[region]).map((department, depIndex) =>
                                Object.keys(groupedAirports[region][department]).map((city, cityIndex) =>
                                    Object.keys(groupedAirports[region][department][city]).map((type, typeIndex) => (
                                        <tr key={`${regIndex}-${depIndex}-${cityIndex}-${typeIndex}`}>
                                            <td scope='row'>{region}</td>
                                            <td>{department}</td>
                                            <td>{city}</td>
                                            <td>{type}</td>
                                            <td>{groupedAirports[region][department][city][type].length}</td>
                                        </tr>
                                    ))
                                )
                            )
                        )}
                    </tbody>
                </table>

                <h2>Estructura Agrupada de Aeropuertos</h2>
                <pre>{JSON.stringify(groupedAirports, null, 2)}</pre>
            </div>
        );
    }

    function AirportVisualization({ data }) { //Visualización del formato establecido para los datos de aeropuertos por región
        const groupedData = groupAirportsByRegionDepartmentCityType(data);
    
        return (
            <div>
                <h2>Estructura Agrupada de Aeropuertos</h2>
                <pre>{JSON.stringify(groupedData, null, 2)}</pre>
            </div>
        );
    }
    
    
    
    



export default App;
