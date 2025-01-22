import React, { useState } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import PatientSidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import {toast, Toaster} from "sonner"

export default function Index({ questions,patient }) {
    const user = usePage().props.auth.user;
    const [answers, setAnswers] = useState({});
    const [patientData, setPatientData] = useState({
        nik: patient?.nik || '',
        name: patient?.name || '',
        age: patient?.age || '',
        email: patient?.email || user.email,
        contact: patient?.contact || '',
        gender: patient?.gender || '',
    });
    const [formErrors, setFormErrors] = useState({});

    const isReadOnly = Boolean(patient);

    // Handle change for answers and patient data
    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
        setFormErrors((prevErrors) => ({ // Clear error for the question when answered
            ...prevErrors,
            [questionId]: undefined,
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

    // Check for unanswered questions
    const unansweredQuestions = questions.filter(question => !answers[question.id]);
    if (unansweredQuestions.length > 0) {
        const newErrors = {};
        unansweredQuestions.forEach(question => {
            newErrors[question.id] = 'This question is required';
        });
        setFormErrors(newErrors);
        toast.error('Please answer all questions before submitting.');
        return;
    }

    // Preparing formatted answers
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questioner_id: questionId,
        answer: answers[questionId],
    }));

    // Submit the answers and patient data to the backend
    router.post(
        route('screening-online.store'),
        {
            ...patientData,
            answers: formattedAnswers,
        },
        {
            onSuccess: () => {
                toast.success('Screening berhasil disimpan!');
            },
            onError: (errors) => {
                if (typeof errors === 'string') {
                    toast.error(errors);
                } else if (typeof errors === 'object') {
                    const errorMessages = Object.values(errors).flat();
                    errorMessages.forEach(error => toast.error(error));
                } else {
                    toast.error('An error occurred during submission.');
                }
            },
        }
    );
};


return (
    <PatientSidebar header={'Screening Now'}>
        <div className="space-y-8">
            <Toaster position="top-center" />
            <Head title="Screening" />
            
            {questions.length === 1 ? (
            <h1 className="text-2xl font-bold">Kuisioner Kesehatan Dan Kesiapan Pendakian Gunung Semeru</h1>
            ): (
                <></>
            )}
            {questions.length === 0 ? (
                <div className="text-center">
                <h1 className="text-2xl font-bold">Ups Maaf</h1>
                    <p className="text-lg font-semibold text-gray-500">
                        Belum bisa melakukan screening. Tidak ada kuesioner yang tersedia saat ini.
                    </p>
                </div>
            ) : (
                
                <form onSubmit={handleSubmit}>
                    {/* Patient Information Inputs */}
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>Informasi Pendaki</CardTitle>
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
                                    readOnly={isReadOnly}
                                />
                                {formErrors.nik && <p className="text-sm text-red-500">{formErrors.nik}</p>}
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
                                    readOnly={isReadOnly}
                                />
                                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
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
                                    readOnly={isReadOnly}
                                />
                                {formErrors.age && <p className="text-sm text-red-500">{formErrors.age}</p>}
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
                                    readOnly={isReadOnly}
                                />
                                {formErrors.contact && <p className="text-sm text-red-500">{formErrors.contact}</p>}
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
                                    placeholder={user.email}
                                    readOnly={isReadOnly}
                                />
                                {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    id="gender"
                                    name="gender"
                                    value={patientData.gender}
                                    onValueChange={(value) =>
                                        setPatientData((prevData) => ({ ...prevData, gender: value }))
                                    }
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
                                {formErrors.gender && <p className="text-sm text-red-500">{formErrors.gender}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {questions.map((question) => (
                        <Card key={question.id} className="mb-4">
                            <CardHeader>
                                <CardTitle>{question.question_text}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Render input berdasarkan tipe pertanyaan */}
                                {question.answer_type === 'text' && (
                                    <div>
                                        <Input
                                            type="text"
                                            value={answers[question.id] || ''}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            placeholder="Enter your answer"
                                        />
                                        {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                    </div>
                                )}
                                {/* Checkbox Input */}
                            {question.answer_type === 'checkbox' && (
                                <div>
                                    
                                    {Array.isArray(question.options) && question.options.map((option, index) => (
                                        <div key={index}>
                                            <Checkbox
                                                checked={answers[question.id]?.includes(option)}
                                                onCheckedChange={(checked) => {
                                                    const updatedAnswers = checked
                                                        ? [...(answers[question.id] || []), option]
                                                        : (answers[question.id] || []).filter((answer) => answer !== option);
                                                    handleAnswerChange(question.id, updatedAnswers);
                                                     // Debugging

                                                }}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}

                            {/* Checkbox with Textarea Input */}
                            {question.answer_type === 'checkbox_textarea' && (
                                <div>
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
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}

                            {/* Select Input */}
                            {question.answer_type === 'select' && (
                                <div>
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
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}

                            {/* Textarea Input */}
                            {question.answer_type === 'textarea' && (
                                <div>
                                    <Textarea
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}
                            {question.answer_type === 'number' && (
                                <div>
                                    <Input
                                        type="number"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}
                            {question.answer_type === 'date' && (
                                <div>
                                    <Input
                                        type="date"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer"
                                    />
                                    {formErrors[question.id] && <p className="text-sm text-red-500">{formErrors[question.id]}</p>}
                                </div>
                            )}

                                {/* Tambahkan jenis input lainnya seperti yang sebelumnya */}
                            </CardContent>
                        </Card>
                    ))}

                    <Button type="submit">Submit Answers</Button>
                </form>
            )}
        </div>
    </PatientSidebar>
);

}

