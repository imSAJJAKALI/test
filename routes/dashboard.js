const express=require("express")
const auth=require("../middleware/authentication")
const Dash=require("../models/dashboard")
const router=express.Router()


router.post("/employees",async(req,res)=>{
    const {firstname,lastnamee,email,department,salary}=req.body
    try {
        const x=new Dash({firstname,lastnamee,email,department,salary})
        await  x.save()
        res.send(x)
    } catch (error) {
        console.log(error);
    }
})
router.get('/dashboard',auth, async (req, res) => {
    try {
      const { pageination } = req.query;
      const Size = 5;
      
      const total = await Dash.countDocuments();
      const start = (pageination - 1) * Size;
      const end = pageination * Size;
     const data = await Dash.find().skip(start).limit(Size);
  
    res.send(data)
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
  



// Update an employee for Edit button
router.patch('/employes/:id',auth, async (req, res) => {
    try {
        const  id  = req.params.id;
        const body = req.body;

        const res = await Dash.findByIdAndUpdate({_id:id},body);
        if (!res) {
            return res.status(404).json({ message: "employe is not persent"});
        }
        return res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});




// Delete an employee for delete button
router.delete('/employes/:id',auth, async (req, res) => {
    try {
        const  id  = req.params.id;
       

    await Dash.findByIdAndDelete(id);
       
        return res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});

router.get('/dashboard/filter', async (req, res) => {
    try {
      const { department } = req.query;
  
     const filteredEmployees = await Dash.find({ department:department });
  
      return res.json({ employees: filteredEmployees });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get("/employee/asc", async (req, res) => {
    try {
      const books = await Dash.find().sort({ salary: 1 });
      res.status(200).json(books);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to retrieve salary" });
    }
  });
  router.get("/employee/desc", async (req, res) => {
    try {
      const books = await Dash.find().sort({ salary: -1 });
      res.status(200).json(books);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to retrieve salary" });
    }
  });

  router.get('/dashboard/searching', async (req, res) => {
    try {
      const { search } = req.query;
  
      const data = { firstName: { $regex: search, $options: 'i' } };
      const Employees = await Dash.find(data);
  
      return res.json({ employees:Employees });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });


  module.exports=router