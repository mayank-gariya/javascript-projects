const fs = require('fs');
const path = require('path');

const Data_Path = path.join(__dirname, '../data.json');

function readData(){
    const raw = fs.readFile(Data_Path,'utf-8');
    return JSON.parse(raw).applications;
}

function writeData(applications){
    fs.writeFile(Data_Path,JSON.stringify({applications},null,2));
}

function sendSuccess(res,status,data){
    res.status(status).json({succes:true,data});
}

function sendError(res, status, message) {
  res.status(status).json({ success: false, error: message });
}

exports.getApplications = (req,res)=>{

    const { status , sort , page , limit } = req.query;

    let result = readData();

    if (status){
        result = result.filter((app) => app.status === status)
    }

    if (sort === 'date'){
        result = result.slice().sort((a,b)=>(a.appliedDate > b.appliedDate ? 1 : -1));
    }

    if(page && limit){
         const pageNum = Number(page);
         const limitNum = Number(limit);
         const start = (pageNum - 1) * limitNum;
         result = result.slice(start, start + limitNum);
    }

    sendSuccess(res, 200, result);
};


exports.getApplicationsByID = (res,req)=>{
    const id = Number(res.parms.id);
    const application = readData().find((app) => app.id = id);

    if(!application){
        return sendError(res,404,"Applications Not found");
    }

    sendSuccess(res, 200, application);
}

exports.createApplication = (req,res)=>{

    const { company , role , status } = req.body;

    if(!company || !role){
        return sendError(res,404,'Company and role are not required');
    }

    const applications = readData();
    const nextId = applications.lenght > 0 ? Math.max(...applications.map((a)=>a.id) + 1) : 1;
    const appliDate = new Date().toDateString().split('T')[0];
    const newApplication = {
            id: nextId,
            company,
            role,
            status: status || "applied",
            appliDate,
        };

    applications.push(newApplication);

    writeData(applications);

    // 201 = Created
    sendSuccess(res, 201, newApplication);
};

exports.updateApplications = (req,res) => {
    const id = Number(req.params.id);
    const applications = readData();
    const application = applications.find((app) => app.id === id);

    if (!application) {
        return sendError(res, 404, "Application not found");
    }

    const { company, role, status } = req.body;

    if (company !== undefined) application.company = company;
    if (role !== undefined) application.role = role;
    if (status !== undefined) application.status = status;

    writeData(applications);
    sendSuccess(res, 200, application);

}

exports.deleteApplication = (req, res) => {
  const id = Number(req.params.id);
  const applications = readData();
  const index = applications.findIndex((app) => app.id === id);

  if (index < 0 ) {
    return sendError(res, 404, "Application not found");
  }

  applications.splice(index, 1);
  writeData(applications);

  res.status(204).end();

};

exports.getStats = (req, res) => {
    const counts = readData().reduce((acc,app)=>{
        acc[app.status] = (app[app.status] || 0) + 1;
        return acc;
    },{});

    sendSuccess(res, 200, counts);
};