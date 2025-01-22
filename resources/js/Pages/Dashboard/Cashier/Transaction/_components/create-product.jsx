import React from 'react';
import { Button } from "@/Components/ui/button";
import { PlusCircle } from "lucide-react";

const AddProductButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Tambah Produk
    </Button>
  );
};

export default AddProductButton;
