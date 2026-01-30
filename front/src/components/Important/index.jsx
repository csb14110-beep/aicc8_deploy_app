import React from 'react';
import Navibar from '../Common/Navibar';
import ItemPanel from '../Common/ItemPanel';

const index = () => {
  return (
    <div className="page_section">
      <Navibar />
      <ItemPanel pageTitle="Important Items" />
    </div>
  );
};

export default index;
