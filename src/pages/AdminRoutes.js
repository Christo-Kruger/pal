import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from './Admin';
import PresentationList from '../components/PresentationList';
import TestList from '../components/TestSlotList';
import CreatePresentationModal from '../components/CreatePresentationModal';
import UpdatePresentationModal from '../components/UpdatePresentationModal';
import CreateTestSlot from '../components/TestSlots/CreateTestSlot';
import UpdateTestSlot from '../components/TestSlots/UpdateTestSlot';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        <Route path="/create-presentation" element={<CreatePresentationModal />} />
        <Route path="/update-presentation/:id" element={<UpdatePresentationModal />} />
        <Route path="/presentations" element={<PresentationList />} />
        <Route path="/create-test" element={<CreateTestSlot />} />
        <Route path="/update-test/:id" element={<UpdateTestSlot />} />
        <Route path="/tests" element={<TestList />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
