import React from 'react';
import { Button } from "@/Components/ui/button";
import { PlusCircle } from "lucide-react";

const AddMedicineButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Tambah Obat
    </Button>
  );
};

export default AddMedicineButton;
