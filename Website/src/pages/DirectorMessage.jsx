/**
 * DirectorMessage.jsx  –  CGS (NEW page)
 *
 * Maps content from cgs-main/founder.html (Director section).
 * Uses the same .Faculty-box / .About-par styling pattern from akuastrono.
 */

import React from 'react';
import '../Styles/Faculty.css';
import '../Styles/About.css';

function DirectorMessage() {
  return (
    <div style={{ padding: '20px' }}>
      <div className="Faculty-box">
        <h1>Director's Message</h1>
        <img
          src="https://akucgs.vercel.app/images/director_img_150.png"
          alt="Dr. Poornima Sekhar Singh – Director, CGS"
        />
        <h3>Dr. Poornima Sekhar Singh</h3>
        <h3>Founding Director</h3>
        <h3>Centre for Geographical Studies, AKU, Patna</h3>
        <h3>Email – director@cgspatna.ac.in</h3>
        <h3>Phone – 9471007084</h3>
        <h3>
          Office: Ground Floor, Centres of Excellence Building,
          AKU Campus, Mithapur, Patna-800001
        </h3>
      </div>

      <div className="About-par">
        <p className="About-detail">
          The Centre for Geographical Studies, Govt. of Bihar, is one of a kind centre
          exclusively devoted to the discipline of geography in its full applied
          potential. This centre is a product of the vision of our Hon'ble Chief
          Minister Shri. Nitish Kumar, who wants this centre to produce cutting-edge
          planning solutions for the myriad of obstacles that Bihar has to overcome in
          its developmental journey.
        </p>
        <br />
        <p className="About-detail">
          As the founding director of the institute, it is my honour as well as my
          promise to not only fulfil the vision of our dynamic Chief Minister but also
          to create this centre as the centre of excellence of research and knowledge
          production. With the patronage of all, I hope to make this centre a numero
          uno in the disciplinary field of Geographical research, especially
          incorporating the very latest in Satellite imagery, GIS, and Remote Sensing.
        </p>
      </div>
    </div>
  );
}

export default DirectorMessage;
