#Radix.Ai

This project was developed by us (Team Clover) as part of the[HackSavvy'24] (https://mgit.ac.in/hacksavvy/) National-level hackathon hosted by [Mahatma Gandhi Institute of Technology] (https://mgit.ac.in/), where we secured 5th place🏅 

Our Project aims to assist Radilogists diagnose diseases accurately and efficiently by:

1.Leveraging Deep Learning to identify pulmonary abnormalities.
2.Utilizing Grad-CAM to localize and visualize regions corresponding to the identified abnormalities
3.Implementing transformer models to generate detailed text radiology reports based on the analyzed chest X-ray image.
4.Integrating the system into a user-friendly Web Application developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack and Flask APIs, which Radiologists can access for streamlined diagnosis and reporting processes.

## Dataset
### ChestX-ray14
The ChestX-ray14 dataset comprises 112,120 frontal-view chest X-ray images of 30,805 unique patients with 14 disease labels. To evaluate the model, we randomly split the dataset into training (70%), validation (10%) and test (20%) sets, following the work in paper. Partitioned image names and corresponding labels are placed under the directory labels.

### IU X-Ray
IU X-ray (Demner-Fushman et al., 2016) is a set of chest X-ray images paired with their corresponding diagnostic reports. The dataset contains 7,470 pairs of images and reports.


## Workflow



