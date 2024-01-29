import React, { Profiler, useEffect, useState } from 'react';
import { db } from './firebase';
import { child, get, getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database';
import { Col, Offcanvas, Row, Table } from 'react-bootstrap'
import './main.css'
export default function StudentDetail() {
    const [input, setInput] = useState({})
    const [student, setStudent] = useState([])
    const [error, setError] = useState({})
    const [id, setId] = useState()
    const [sortBy, setSortBy] = useState('');
    const [edit, setEdit] = useState(false)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [selectedAdd, setselectedAdd] = useState([]);
    const [noRecords, setNoRecords] = useState(false);
    const originalData = student
    const [data, setData] = useState(() => {
        return student || [];
    });
    useEffect(() => {
        if (student.length === 0) {
            setNoRecords(true);
        } else {
            setNoRecords(false);
        }
    }, [student])
    useEffect(() => {
        const studentRef = ref(db, 'student');
        onValue(studentRef, (snapshot) => {
            var list = []
            snapshot.forEach((snapchild) => {
                var id = snapchild.key
                var data = snapchild.val()
                var detail = { id, ...data }
                list.push(detail)
            })
            setStudent(list)
        })
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault()
        if (edit && id) {
            const studentRef = ref(db, `student/${id}`);
            update(studentRef, input).then(() => {
                console.log('updated...')
            })
            setEdit(false)
            setInput('')
        } else {
            handleAdd()
            setInput('')
        }
    }
    const handleAdd = () => {
        const newError = {};
        if (input.name && input.email && input.address) {
            const studentRef = ref(db, 'student');
            const newRef = push(studentRef);
            set(newRef, input)
        } else {
            if (!input.name) {
                newError.name = 'Name is required!';
            }
            if (!input.email) {
                newError.email = 'Email is required!';
            }
            if (!input.address) {
                newError.address = 'Address is required!';
            }
        }
        setError(newError);
    };
    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
        setError({ ...error, [e.target.name]: '' });
    }
    const handleDelete = (id) => {
        const studentRef = ref(db, `student/${id}`);
        remove(studentRef).then(() => {
            console.log('Success...')
        })
    }
    const handleEdit = (id) => {
        const studentRef = ref(db, `student/${id}`);
        get(studentRef).then((item) => {
            var data = item.val()
            setInput({ ...input, ...data })
            setId(id)
            setEdit(true)
        })

    }
    const handleCheckboxChange = (e) => {
        const checkboxName = e.target.name;

        if (e.target.checked) {
            setselectedAdd((prevAdd) => [...prevAdd, checkboxName]);
        } else {
            setselectedAdd((prevAdd) => prevAdd.filter((address) => address !== checkboxName));
        }
    };

    const handleApplyFilter = () => {
        const filteredData = originalData.filter((item) => selectedAdd.includes(item.address));
        setStudent(filteredData);
        handleClose();
    };

    const handleResetFilter = () => {
        setStudent(originalData);
        handleClose();
        setselectedAdd([]);
    };
    const handleSort = (change) => {
        setSortBy(change)
        let sortedData = [...student];

        switch (change) {
            case "A-Z":
                sortedData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Z-A":
                sortedData.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }
        setStudent(sortedData);
    };

    const handleSearch = (e) => {
        const users = student || [];
        const searchUser = e.target.value.toLowerCase();

        if (searchUser !== '') {
            const result = users.filter((item) => item.name.toLowerCase().startsWith(searchUser));
            setStudent(result)
        }
        if (users == []) {
            setStudent(originalData)
        }
        // const users = student
        // const searchUser = e.target.value.toLowerCase();
        // const item = users.filter((item) => item.name.toLowerCase().startsWith(searchUser))
        // setStudent(item)
    };


    return (
        <>
            <Offcanvas show={show} onHide={handleClose} backdrop="static" className="offcanvas offcanvas-bottom dark-bg text-light" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter</Offcanvas.Title>
                    
                </Offcanvas.Header>
                <Offcanvas.Body className="">
                    <h5>Address</h5>
                    <ul className='m-0 p-0'>
                        <li className='list-unstyled ps-0 pt-2 pb-2 pe-3 ms-0'>
                            <input className='me-2' type="checkbox" name="Surat" onChange={handleCheckboxChange} checked={selectedAdd.includes('Surat')}
                            />Surat
                        </li>
                        <li className='list-unstyled ps-0 pt-2 pb-2 pe-3 ms-0'>
                            <input className='me-2' type="checkbox" name="Vadodara" onChange={handleCheckboxChange} checked={selectedAdd.includes('Vadodara')}
                            />Vadodara
                        </li>
                        <li className='list-unstyled ps-0 pt-2 pb-2 pe-3 ms-0'>
                            <input className='me-2' type="checkbox" name="Ahemdabad" onChange={handleCheckboxChange} checked={selectedAdd.includes('Ahemdabad')}
                            />Ahemdabad
                        </li>
                        <li className='list-unstyled ps-0 pt-2 pb-2 pe-3 ms-0'>
                            <input className='me-2' type="checkbox" name="Rajkot" onChange={handleCheckboxChange} checked={selectedAdd.includes('Rajkot')}
                            />Rajkot
                        </li>
                        <li className='list-unstyled ps-0 pt-2 pb-2 pe-3 ms-0'>
                            <input className='me-2' type="checkbox" name="Bardoli" onChange={handleCheckboxChange} checked={selectedAdd.includes('Bardoli')}
                            />Bardoli
                        </li>
                        <li className='list-unstyled ps-0 pt-2 pb-2 pe-3 ms-0'>
                            <input className='me-2' type="checkbox" name="Gandhinagar" onChange={handleCheckboxChange} checked={selectedAdd.includes('Gandhinagar')}
                            />Gandhinagar
                        </li>
                        <li className='list-unstyled ps-0 pt-2 pb-2 pe-3 ms-0'>
                            <input className='me-2' type="checkbox" name="Vapi" onChange={handleCheckboxChange} checked={selectedAdd.includes('Vapi')}
                            />Vapi
                        </li>
                        <li className='list-unstyled ps-0 pt-2 pb-2 pe-3 ms-0'>
                            <input className='me-2' type="checkbox" name="Jamnagar" onChange={handleCheckboxChange} checked={selectedAdd.includes('Jamnagar')}
                            />Jamnagar
                        </li>
                    </ul>
                    <div className='d-flex mt-5' id="offcanvasBottomLabel">
                        <button onClick={handleResetFilter} className='btn btn-danger w-50'>Reset</button>
                        <button onClick={handleApplyFilter} className='btn btn-dark w-50 ms-2'>Apply</button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            <main className='bg-img vh-100 frog-img'>
                <Row className='g-0'>
                    <Col lg={4}>
                        <div className="forms m-3">
                            <h5 className='text-light fs-4 mb-4'> {edit ? 'Update' : "Add"} Student</h5>
                            <form onSubmit={handleSubmit}>
                                <input type='text' name='name' className='form-control mb-4' value={input ? input.name : ''} placeholder='Enter Name' onChange={handleChange} />
                                <p className='error'>{error.name}</p>
                                <input type='email' name='email' className='form-control mb-4' value={input ? input.email : ''} placeholder='Enter Email' onChange={handleChange} />
                                <p className='error'>{error.email}</p>
                                <textarea name='address' className='form-control hei' value={input ? input.address : ''} placeholder='Enter Address' onChange={handleChange} />
                                <p className='error mt-3'>{error.address}</p>
                                <button className='btn btn-outline-light mt-4 px-4'> {edit ? 'UPDATE' : "ADD"} </button>
                            </form>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <div className="tables m-3 ms-0">
                            <h5 className='text-light fs-4 mb-4'>Student List</h5>
                            <div className="d-flex justify-content-between mb-4">
                                <button className="btn btn-light me-3 w-25" variant="primary" onClick={handleShow}><i
                                    className="bi bi-funnel me-1"></i>Filter</button>
                                <input type="text" onChange={handleSearch} className='colr form-control' placeholder='Search...' />
                                <select name="sortBy" className='px-3 pt-1 pb-2 rounded-2 ms-3' value={sortBy} onChange={(e) => handleSort(e.target.value)}>
                                    <option value="" className='m-0 px-2 py-1'>Sort By</option>
                                    <option value="A-Z" className='m-0 px-2 py-1'>A - Z</option>
                                    <option value="Z-A" className='m-0 px-2 py-1'>Z - A</option>
                                </select>
                            </div>
                            <div className="ove">
                                <Table className='table rounded-5 ' responsive striped bordered hover variant="light">
                                    <thead>
                                        <tr>
                                            <th className='text-center'>S.R. No.</th>
                                            <th className='text-center'>Name</th>
                                            <th className='text-center'>Email</th>
                                            <th className='text-center'>Address</th>
                                            <th className='text-center'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            noRecords ? (
                                                <tr>
                                                    <td className='text-center text-dark-emphasis fw-bolder fs-4 py-5' colSpan={5}>Empty</td>
                                                </tr>
                                            ) : (
                                                student && student.map((item, index) =>

                                                    <tr>
                                                        <td className='text-center'>{index + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.address}</td>
                                                        <td className='text-center d-flex justify-content-center'>
                                                            <button className='btn btn-outline-secondary me-1' onClick={() => handleDelete(item.id)}><i className="bi bi-trash-fill text-danger"></i></button>
                                                            <button className='btn btn-outline-secondary ms-1 ' onClick={() => handleEdit(item.id)}><i className="bi bi-pencil-fill text-success"></i></button>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        }

                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                </Row>
            </main >
        </>
    )
}
