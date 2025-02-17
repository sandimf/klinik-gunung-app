import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

const BodyMap = ({ initialBodyPartData }) => {
  const [hoveredPart, setHoveredPart] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bodyPartData, setBodyPartData] = useState(initialBodyPartData || {});


  const { data, setData, post, processing, errors } = useForm({
    bodyPart: '',
    data: '',
  });

  const handleMouseEnter = (partId) => {
    setHoveredPart(partId);
  };

  const handleMouseLeave = () => {
    setHoveredPart(null);
  };

  const handleClick = (partId) => {
    setSelectedPart(partId);
    setIsDialogOpen(true);
    setData({
      bodyPart: partId,
      data: bodyPartData[partId] || '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('body.store'), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setBodyPartData(prevData => ({
          ...prevData,
          [data.bodyPart]: data.data
        }));
        setIsDialogOpen(false);
      },
    });
  };

  const getPartColor = (partId) => {
    if (!bodyPartData) return "transparent"; // Handle undefined state
    if (bodyPartData[partId]) return "rgb(255, 0, 0)";
    if (partId === hoveredPart) return "rgb(200, 200, 200)";
    return "transparent";
  };
  

  return (
    <div className="body-map-container">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="800px" height="1360px" viewBox="0 0 800 1360">
        
        <path
          id="head"
          fill={getPartColor("head")}
          stroke="#8C8C8C"
          strokeWidth={bodyPartData["head"] ? "2" : "1"}
          vectorEffect="non-scaling-stroke"
          d="M346,106.834c2.04,7.695,6.667,23,6.667,33c-3.333,6.5-7.168,2.833-8.5,1.667c-1.333-1.167-6.167-12.166-7.167-15.833S333.833,109,337.833,105S345,105.001,346,106.834z M400.167,182c21.667,0,36.5-8.667,45.708-23c2.625-5.625,5-15.25,4.75-18.625c-0.708-5.125,4.708-28.041,5.709-32.708c0.667-7.333,1.666-6.667,0-38.667C454.668,37,420,18,401,18c-30.833,0-50.167,31.5-53.167,44.5c-1.915,8.295-2.833,23.5-2.5,28.167s1,12.333,0.667,16.167c2.04,7.695,6.667,23,6.667,33c0.667,5.167,1.167,12.5,3.333,18.834C359,162.667,378.5,182,400.167,182z M450.625,140.375c3.75,6.375,8.875,3.25,10-1.75s7.625-7.875,6.75-23.625s-8.041-11.666-11.041-7.333C455.333,112.334,449.917,135.25,450.625,140.375z"
          onMouseEnter={() => handleMouseEnter("head")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("head")}
        />
        
        
        <path
          id="chest"
          fill={getPartColor("chest")}
          stroke="#8C8C8C"
          strokeWidth={bodyPartData["chest"] ? "2" : "1"}
          vectorEffect="non-scaling-stroke"
          d="M524.5,294c-2.018-20.749-37.75-48.25-48.562-51.137c-4.605,0.447-9.488,0.376-14.438-0.363c-12.805-1.911-47-1.667-50.833,4.333c-3.833,6-15.5,5.833-19.667,0c-4.167-5.833-29.667-4.5-45.333-3.667c-5.294,0.281-10.873-0.674-16.059-2.159c-8.004,3.48-46.033,26.426-52.127,58.308c1.013-1.67,1.948-3.439,2.793-5.316c-0.845,1.877-1.78,3.645-2.793,5.316c-0.459,2.402-0.744,4.853-0.814,7.351c-1,35.667,0.003,72.11-0.165,85.722c0.383-0.096,9.665,25.111,12.165,30.778c2.5,5.667,5.083,17.833,8.583,24.583C305.5,455.5,344,473,370.5,466s36.5-6.244,65,0.128c28.5,6.372,52.668-2.794,73.084-27.211c1.25-3.25,4.75-11.75,5.333-15s2.667-6.999,4.084-9.749c1.417-2.75,7.455-21.675,8.005-21.176C526.678,379.65,525.667,306.001,524.5,294z"
          onMouseEnter={() => handleMouseEnter("chest")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("chest")}
        />
        
        {/* Add more path elements for other body parts here */}
      </svg>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold capitalize">{data.bodyPart}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-4">
            <Label htmlFor="bodyPartInput" className="text-lg font-medium">
              Enter data for {data.bodyPart}:
            </Label>
            <Input
              id="bodyPartInput"
              value={data.data}
              onChange={(e) => setData('data', e.target.value)}
              placeholder={`Enter data for ${data.bodyPart}`}
              className="mt-2"
            />
            {errors.data && <div className="text-red-500 text-sm mt-1">{errors.data}</div>}
            <div className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BodyMap;

