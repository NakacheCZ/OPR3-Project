import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import '../App.css';


export default function InfoPage() {
  const navigate = useNavigate();


  const handleBackClick = () => {
    navigate('/');
  };

  const handleSourceClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
    {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center' }}>Formulas Used:</h2>
          <hr style={{ marginBottom: '10px' }} />

          <h2 style={{ textAlign: 'center', fontSize: '28px' }}>
            Modified De Marre Formula for full caliber shells
          </h2>
          <img
  src="Images/formula1.png"
  alt="De Marre Formula"
  style={{ maxWidth: '600px', width: '100%', margin: '5px auto', display: 'block' }}
/>

          <div style={{ margin: '0 20px 20px', fontSize: '16px' }}>
            <p>M - Shell Mass - The mass of the projectile alone, without the cartridge</p>
            <p>D - Shell Diameter - The diameter of the attacking shell without the sabot if there was one</p>
            <p>V - Shell Velocity - The velocity of the attacking shell at the point of impact</p>
            <p>θ - Angle of Impact - The angle at which the shell impacts the plate</p>
            <p>T - Shell Penetration - The maximum plate thickness that the shell can penetrate</p>
            <p>K - De Marre's Constant - A dimensionless constant that varies from shell to shell. For soviet shells it is ~2400, while for other nations it is usually ~2000</p>
            <p>n - Thickness exponent - A dimensionless constant that affects the shell's performance against angled armor. A value of 1.4 usually gives the most accurate results. For APCR and APDS shells it should be around 1.1 - 1.2</p>
            <p>s - Absolute scale exponent - Always 0.1</p>
          </div>

          <hr style={{ marginBottom: '10px' }} />

          <h2 style={{ textAlign: 'center', fontSize: '28px' }}>
            Perforation Formula for Long Rod Penetrators by Willi Odermatt
          </h2>
          <img src="Images/Formula2.png" alt="Odermatt Formula" style={{ maxWidth: '600px', width: '100%', margin: '5px auto', display: 'block' }} />
          <img src="Images/parameter1.png" alt="Parameters 1" style={{ maxWidth: '600px', width: '100%', margin: '5px auto', display: 'block' }} />
          <img src="Images/parameter2.png" alt="Parameters 2" style={{ maxWidth: '600px', width: '100%', margin: '5px auto', display: 'block' }} />
          
          <hr style={{ marginBottom: '10px' }} />

          <h2 style={{ textAlign: 'center', fontSize: '28px' }}>
            Simplified HEAT penetration model developed by FOI, (Elfving et al)
          </h2>
          <img src="Images/Formula3.png" alt="HEAT Model" style={{ maxWidth: '600px', width: '100%', margin: '0 0 20px', display: 'block' }} />

          <hr style={{ marginBottom: '10px' }} />

          <h2 style={{ textAlign: 'center' }}>Sources:</h2>
          <p
            style={{ textAlign: 'center', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleSourceClick('https://armor-sim.web.app')}
          >
            Armor Penetration Calculator for Full Caliber Shells
          </p>
          <p
            style={{ textAlign: 'center', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleSourceClick('https://www.longrods.ch/govpars.php')}
          >
            Long Rod Penetrators
          </p>
          <p
            style={{ textAlign: 'center', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleSourceClick('https://defence.bergter.com/blog/apfsds')}
          >
            APFSDS stats
          </p>
          <p
            style={{ textAlign: 'center', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleSourceClick('https://www.diva-portal.org/smash/get/diva2:643824/FULLTEXT01.pdf')}
          >
            SHAPED CHARGE CALCULATION MODELS FOR EXPLOSIVE ORDNANCE DISPOSAL OPERATIONS
          </p>
        </div>
      </div>
    </>
  );
}