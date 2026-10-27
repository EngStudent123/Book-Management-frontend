import React, { useEffect, useState } from 'react'
import { api } from './apiServices';

const App = () => {
  
  let [allBooks , setAllBooks] = useState([]);

  let [btn , setBtn] = useState(false);

   let [searchTitle , setSearchTitle] = useState("");

    let [searchAuthor , setSearchAuthor] = useState("");

    let [cate , setCate] = useState("Programming");

    let [type , setType] = useState("title");

    let [searchValue , setSearchValue] = useState("");

  let [book , setBook] = useState({
    title:'',
    author:'',
    price:'',
    category:'',
    available:''
  })

 const loadBook = async ()=>{
     const {data} = await api.get(`/getAll`);
     setAllBooks(data);
     console.log(data);
  }

  useEffect(()=>{
    loadBook();
  } , []);

  const handleChange=(e)=>{
    const {name , value} = e.target;
    setBook({...book , [name]: value});
  }

   const handleDelete = async (id)=>{
    const {data} = await api.delete(`/delete/${id}`);
    console.log(data);
    loadBook();
   }

   const clearForm = () =>{
    setBook({
      title:'',
      author:'',
      price:'',
      category:'',
      available:''
    })
   }

   const handleEdit =(b)=>{
     setBook(b);
     setBtn(true);

   }

   const handleSubmit =async (e)=>{
      e.preventDefault();

      if(book.price <= 0){
            alert("Price cannot be zero!");
          }

          else if(book.title.trim().length <= 2){
            alert("Please add valid title");
          }

          else if(book.author.trim().length <= 2){
            alert("Please add valid author name");
          }

          else if(book.category.trim().length <= 2){
            alert("Please add valid category");
          }
          else{
                if(btn){
        const {data} = await api.put(`/update/${book.id}/` , book);
        console.log(data);

      }  
          else{
             const {data} = await api.post(`/add/` , book);
           console.log(data);
          }
        }
        
            loadBook();
            clearForm();
            setBtn(false);
   }

   const handleSearch = async()=>{

    if(searchValue == ""  || searchValue.trim().length ==0){
      alert("Please Enter title/name");
      return;
    }
      
       if(type == "title"){
         const {data} = await api.get(`/gettitle/${searchValue}`);
          setAllBooks(data);
          
       }else{
             const {data} = await api.get(`/getAuthor/${searchValue}`);
            setAllBooks(data);
       }
       setSearchValue("");
   }


    const handleShow = ()=>{
    loadBook();
    }

// Filter by category
   const handleCayegory =async (e)=>{

    if(cate == "all"){
      loadBook();
    }else{
      const {data} = await api.get(`/getCat/${cate}`);

      setAllBooks(data);

    }
      
   }


  return (
    <div>
      <center>
        <h2>{btn ? "Edit Book Details" : "Add Book Details" }</h2>

        <form onSubmit={handleSubmit}>
          <input type='text' name="title" value={book.title}  placeholder= "Enter title" onChange={handleChange} required/><br/><br/>
          <input type='text' name="author" value={book.author}  placeholder= "Enter Author name"  onChange={handleChange} required/><br/><br/>
          <input type='text' name="price" value={book.price}   placeholder= "Enter price" onChange={handleChange} required/><br/><br/>
          <input type='text' name="category" value={book.category}   placeholder= "Enter category"  onChange={handleChange} required/><br/><br/>
          <input type='text' name="available" value={book.available}    placeholder= "Enter available books" onChange={handleChange}required/><br/><br/>


          <button type="submit" class="btn btn-success">{btn ? "Edit" : "Add" }</button>
          
          
        </form>
        <br/>

        <h2>Book Table</h2>

        <button type='button' style={{background:'orange'}}  onClick={handleShow}>Show All</button><br/><br/>


       Search By:<select name='type' value={type} onChange={(e)=>setType(e.target.value)}>
          <option value="title">Title</option>
          <option value="author">Author</option>
           <option value="category">Category</option>
          </select>

       {"  "}

       {    (type == "category") ?  
       (
       <>
      Search by Category : <select name='cate' value={cate} onChange={(e)=>setCate(e.target.value)}>
          <option value="Programming">Programming</option>
          <option value="Software Engineering">Software Engineering</option>
           <option value="Fiction">Fiction</option>
            <option value="Biography">Biography</option>
             <option value="language">language</option>
             <option value="all">All</option>

        </select>{"  "}
        <button type='button' class="btn btn-secondary" onClick={handleCayegory}>Search</button>
        </>
        )
       
        : 
        (  
        <>
         <input type='text' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}/>{"  "}
        <button type="button" class="btn btn-secondary" onClick={handleSearch}>Search</button>
        </>
       )
        }

        
        <br/><br/>
        
      <table  class="table table-striped" border={2}>
        <thead>
          <tr>
           <th> Id</th>
            <th> Title</th>
             <th> Author</th>
              <th> Price</th>
               <th> Category</th>
                <th> Available</th>
                <th>Action</th>
          </tr>

        </thead>
        <tbody>
          {allBooks.map((b)=>(
            <tr>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.price}</td>
              <td>{b.category}</td>
              <td>{b.available}</td>
              <td><button type="button" class="btn btn-danger" onClick={()=>handleDelete(b.id)}>Delete</button>{" "}
              <button type="button"  class="btn btn-warning" onClick={()=>handleEdit(b)}>Edit</button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      </center>
      
    </div>
  )
}

export default App
