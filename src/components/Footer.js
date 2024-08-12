import React from 'react';
import './Footer.css';

const Footer = () => {
    return(
        <div className='wrapper'>
            
            <footer className='footer'>
                <div className='grupo1'>

                    <div className='box'>
                        {/* imagen */}
                    </div>

                    <div className='box'>
                        <h2>Sebastian Silva Canizalez</h2>
                        <p>Prueba tecnica.</p>
                        <p>Ingeniero de software.</p>
                    </div>

                </div>

                <div className='grupo2'>
                    <small>&copy; 2024 <b>SebSC</b> - Todos los derechos Reservados.</small>
                </div>

            </footer>
        </div>
    )
}

export default Footer;