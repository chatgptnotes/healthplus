import Patient from "../Models/patients";
import Appointment from "../Models/Appointment";

export const PATIENTS=[

	new Patient('p1', 'Arjun Sharma', 25, 'male','Crocin Allergid', 'Flu'),
	new Patient('p2', 'Rohit Patel', 35, 'male','Crocin Disprin', 'Common Flu'),
	new Patient('p3', 'Vikram Singh', 45, 'male','Crocin Allergid, Disprin', 'Headache'),
	new Patient('p4', 'Amit Kumar', 26, 'male','Crocin, Allergid, Combilflam', 'Stomachache'),
	new Patient('p5', 'Priya Gupta', 29, 'female','Crocin, Allergid, rogaine', 'HairLoss'),
	new Patient('p6', 'Suresh Verma', 33, 'male','Crocin, Allergid, remdesivir', 'Coronavirus'),

];



export const APPOINTMENTS=[
	new Appointment('a1','Arjun Sharma',829473283,'arjun@gmail.com','9th January, 2021','2.00 P.M',1200),
	new Appointment('a2','Rohit Patel',829473283,'rohit@gmail.com','10th January, 2021','3.00 P.M',1200),
	new Appointment('a3','Amit Kumar',829473283,'amit@gmail.com','12th January, 2021','6.00 P.M',1200),
	new Appointment('a4','Vikram Singh',829473283,'vikram@gmail.com','14th January, 2021','7.00 P.M',1200),
	new Appointment('a5','Rajesh Joshi',829473283,'rajesh@gmail.com','16th January, 2021','8.00 P.M',1200),
	new Appointment('a6','Kiran Mehta',829473283,'kiran@gmail.com','17th January, 2021','1.00 P.M',1200),
	

];

