import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";

export default function ScreeningOffline({ questions, errors }) {   
    const [answers, setAnswers] = useState({});
    const [patientData, setPatientData] = useState({
        nik: '',
        name: '',
        age: '',
        email: '',
        contact: '',
        gender: 'other',
    });

    // Handle change for answers and patient data
    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const handlePatientDataChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Preparing formatted answers
        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            questioner_id: questionId,
            answer: answers[questionId],
        }));

        // Submit the answers and patient data to the backend
        router.post(route('screening-now.index'), {
            ...patientData,
            answers: formattedAnswers,
        }).then(() => {
            // If errors are returned, they will be captured in the `errors` prop
        });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Screening Questionnaire</h1>

            <form onSubmit={handleSubmit}>
                {/* Patient Information Inputs */}
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* NIK */}
                        <div>
                            <Label htmlFor="nik">NIK</Label>
                            <Input
                                id="nik"
                                name="nik"
                                type="text"
                                value={patientData.nik}
                                onChange={handlePatientDataChange}
                                placeholder="Enter NIK"
                            />
                            {errors.nik && <p className="text-sm text-red-500">{errors.nik}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={patientData.name}
                                onChange={handlePatientDataChange}
                                placeholder="Enter name"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Age */}
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                value={patientData.age}
                                onChange={handlePatientDataChange}
                                placeholder="Enter age"
                            />
                            {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
                        </div>

                        {/* Contact */}
                        <div>
                            <Label htmlFor="contact">Contact</Label>
                            <Input
                                id="contact"
                                name="contact"
                                type="text"
                                value={patientData.contact}
                                onChange={handlePatientDataChange}
                                placeholder="Enter contact number"
                            />
                            {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                value={patientData.email}
                                onChange={handlePatientDataChange}
                                placeholder="Enter Email"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                id="gender"
                                name="gender"
                                value={patientData.gender}
                                onValueChange={(value) => setPatientData((prevData) => ({ ...prevData, gender: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Questionnaire Section */}
                {questions.map((question) => (
                    <Card key={question.id} className="mb-4">
                        <CardHeader>
                            <CardTitle>{question.question_text}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Text Input */}
                            {question.answer_type === 'text' && (
                                <div>
                                    <Label>Answer</Label>
                                    <Input
                                        type="text"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {errors.answers && errors.answers[question.id] && (
                                        <p className="text-sm text-red-500">{errors.answers[question.id]}</p>
                                    )}
                                </div>
                            )}

                            {/* Checkbox Input */}
                            {question.answer_type === 'checkbox' && (
                                <div>
                                    <Label>Options</Label>
                                    {Array.isArray(question.options) && question.options.map((option, index) => (
                                        <div key={index}>
                                            <Checkbox
                                                checked={answers[question.id]?.includes(option)}
                                                onCheckedChange={(checked) => {
                                                    const updatedAnswers = checked
                                                        ? [...(answers[question.id] || []), option]
                                                        : (answers[question.id] || []).filter((answer) => answer !== option);
                                                    handleAnswerChange(question.id, updatedAnswers);
                                                }}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                    {errors.answers && errors.answers[question.id] && (
                                        <p className="text-sm text-red-500">{errors.answers[question.id]}</p>
                                    )}
                                </div>
                            )}

                            {/* Checkbox with Textarea Input */}
                            {question.answer_type === 'checkbox_textarea' && (
                                <div>
                                    <Label>Options</Label>
                                    {Array.isArray(question.options) && question.options.map((option, index) => (
                                        <div key={index}>
                                            <Checkbox
                                                checked={Array.isArray(answers[question.id]?.options) && answers[question.id]?.options.includes(option)}
                                                onCheckedChange={(checked) => {
                                                    const updatedAnswers = { ...answers[question.id] };
                                                    updatedAnswers.options = Array.isArray(updatedAnswers.options) ? [...updatedAnswers.options] : [];
                                                    if (checked) {
                                                        updatedAnswers.options.push(option);
                                                    } else {
                                                        const indexToRemove = updatedAnswers.options.indexOf(option);
                                                        if (indexToRemove > -1) {
                                                            updatedAnswers.options.splice(indexToRemove, 1);
                                                        }
                                                    }
                                                    handleAnswerChange(question.id, updatedAnswers);
                                                }}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                    <Textarea
                                        value={answers[question.id]?.textarea || ''}
                                        onChange={(e) => {
                                            const updatedAnswers = { ...answers[question.id], textarea: e.target.value };
                                            handleAnswerChange(question.id, updatedAnswers);
                                        }}
                                        placeholder="Jelaskan"
                                    />
                                    {errors.answers && errors.answers[question.id] && (
                                        <p className="text-sm text-red-500">{errors.answers[question.id]}</p>
                                    )}
                                </div>
                            )}

                            {/* Select Input */}
                            {question.answer_type === 'select' && (
                                <div>
                                    <Label>Options</Label>
                                    <Select
                                        value={answers[question.id] || ''}
                                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(question.options) && question.options.map((option, index) => (
                                                <SelectItem key={index} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.answers && errors.answers[question.id] && (
                                        <p className="text-sm text-red-500">{errors.answers[question.id]}</p>
                                    )}
                                </div>
                            )}

                            {/* Textarea Input */}
                            {question.answer_type === 'textarea' && (
                                <div>
                                    <Label>Answer</Label>
                                    <Textarea
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {errors.answers && errors.answers[question.id] && (
                                        <p className="text-sm text-red-500">{errors.answers[question.id]}</p>
                                    )}
                                </div>
                            )}
                            {question.answer_type === 'number' && (
                                <div>
                                    <Label>Answer</Label>
                                    <Input
                                        type="number"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {errors.answers && errors.answers[question.id] && (
                                        <p className="text-sm text-red-500">{errors.answers[question.id]}</p>
                                    )}
                                </div>
                            )}
                            {question.answer_type === 'date' && (
                                <div>
                                    <Label>Answer</Label>
                                    <Input
                                        type="date"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {errors.answers && errors.answers[question.id] && (
                                        <p className="text-sm text-red-500">{errors.answers[question.id]}</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                <Button type="submit">Submit Answers</Button>
            </form>
        </div>
    );
}
