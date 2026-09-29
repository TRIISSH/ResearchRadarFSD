const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Paper = require('../models/Paper');

dotenv.config();

const papers = [
  {
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin",
    category: "Artificial Intelligence",
    year: 2017,
    doi: "10.48550/arXiv.1706.03762",
    sourceUrl: "https://doi.org/10.48550/arXiv.1706.03762",
    abstract: "This paper introduces the Transformer, a neural-network architecture based entirely on attention mechanisms rather than recurrence or convolution. The authors demonstrate how attention can be used to model relationships between elements in sequence-transduction tasks and provide an architecture that is more parallelizable and efficient to train.",
    verificationStatus: "verified"
  },
  {
    title: "Deep Residual Learning for Image Recognition",
    authors: "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
    category: "Artificial Intelligence",
    year: 2016,
    doi: "10.1109/CVPR.2016.90",
    sourceUrl: "https://doi.org/10.1109/CVPR.2016.90",
    abstract: "This paper introduces residual learning, a framework designed to make very deep neural networks easier to train. The proposed residual networks use shortcut connections to learn residual functions and demonstrate strong performance on image-recognition benchmarks, including ImageNet and CIFAR-10.",
    verificationStatus: "verified"
  },
  {
    title: "Random Forests",
    authors: "Leo Breiman",
    category: "Machine Learning",
    year: 2001,
    doi: "10.1023/A:1010933404324",
    sourceUrl: "https://doi.org/10.1023/A:1010933404324",
    abstract: "This paper presents Random Forests, an ensemble learning method that combines multiple decision-tree predictors generated using randomized feature selection and sampling. The study analyzes their generalization behavior, robustness to noise, variable importance, classification, and regression applications.",
    verificationStatus: "verified"
  },
  {
    title: "XGBoost: A Scalable Tree Boosting System",
    authors: "Tianqi Chen, Carlos Guestrin",
    category: "Machine Learning",
    year: 2016,
    doi: "10.1145/2939672.2939785",
    sourceUrl: "https://doi.org/10.1145/2939672.2939785",
    abstract: "This paper presents XGBoost, a scalable implementation of gradient tree boosting. It introduces techniques including sparsity-aware learning and approximate tree construction while optimizing system-level factors such as cache usage, data compression, and distributed execution.",
    verificationStatus: "verified"
  },
  {
    title: "A Comparison of Machine Learning Techniques for Phishing Detection",
    authors: "Saeed Abu-Nimeh, Dario Nappa, Xinlei Wang, Suku Nair",
    category: "Cybersecurity",
    year: 2007,
    doi: "10.1145/1299015.1299021",
    sourceUrl: "https://doi.org/10.1145/1299015.1299021",
    abstract: "This study compares several machine-learning methods for detecting phishing emails, including logistic regression, decision trees, Bayesian methods, support vector machines, random forests, and neural networks. The research evaluates these techniques using a dataset of phishing and legitimate emails and examines their predictive performance.",
    verificationStatus: "verified"
  },
  {
    title: "Detection of Phishing Attacks: A Machine Learning Approach",
    authors: "Ram Basnet, Srinivas Mukkamala, Andrew H. Sung",
    category: "Cybersecurity",
    year: 2008,
    doi: "10.1007/978-3-540-77465-5_19",
    sourceUrl: "https://doi.org/10.1007/978-3-540-77465-5_19",
    abstract: "This research investigates the use of machine-learning techniques for identifying phishing websites and attacks. It studies characteristics of phishing pages and evaluates learning-based approaches for distinguishing malicious websites from legitimate ones.",
    verificationStatus: "verified"
  },
  {
    title: "MapReduce: Simplified Data Processing on Large Clusters",
    authors: "Jeffrey Dean, Sanjay Ghemawat",
    category: "Data Science",
    year: 2008,
    doi: "10.1145/1327452.1327492",
    sourceUrl: "https://doi.org/10.1145/1327452.1327492",
    abstract: "This paper presents MapReduce, a programming model and implementation for processing very large datasets across clusters of machines. It simplifies distributed computation by automatically handling data partitioning, scheduling, communication, and machine failures while allowing programmers to define map and reduce operations.",
    verificationStatus: "verified"
  },
  {
    title: "Petuum: A New Platform for Distributed Machine Learning on Big Data",
    authors: "Eric P. Xing, Qirong Ho, Wei Dai, Jin-Kyu Kim, Jinliang Wei, Seunghak Lee, Xun Zheng, Pengtao Xie, Abhimanu Kumar, Yaoliang Yu",
    category: "Data Science",
    year: 2015,
    doi: "10.1145/2783258.2783323",
    sourceUrl: "https://doi.org/10.1145/2783258.2783323",
    abstract: "This paper introduces Petuum, a distributed platform designed to support large-scale machine-learning workloads involving massive datasets and models. It investigates system designs for efficient parallel computation and scalable learning beyond traditional bulk-synchronous processing approaches.",
    verificationStatus: "verified"
  },
  {
    title: "A Relational Model of Data for Large Shared Data Banks",
    authors: "E. F. Codd",
    category: "Computer Science",
    year: 1970,
    doi: "10.1145/362384.362685",
    sourceUrl: "https://doi.org/10.1145/362384.362685",
    abstract: "This foundational paper introduces the relational model for organizing and managing data in large database systems. It describes relations, data independence, redundancy and consistency considerations, and a relational approach that separates applications from the physical organization of stored data.",
    verificationStatus: "verified"
  },
  {
    title: "Architecture of the IBM System/360",
    authors: "Gene M. Amdahl, Gerrit A. Blaauw, Frederick P. Brooks Jr.",
    category: "Computer Science",
    year: 1964,
    doi: "10.1147/rd.82.0087",
    sourceUrl: "https://ieeexplore.ieee.org/abstract/document/5392210",
    abstract: "This paper describes the architecture of the IBM System/360 computer family and the design principles behind it. It discusses storage organization, input/output, instruction architecture, system compatibility, and the challenge of supporting different classes of scientific, commercial, and real-time computing workloads.",
    verificationStatus: "verified"
  },
  {
    title: "The Internet of Things: A Survey",
    authors: "Luigi Atzori, Antonio Iera, Giacomo Morabito",
    category: "Internet of Things",
    year: 2010,
    doi: "10.1016/j.comnet.2010.05.010",
    sourceUrl: "https://doi.org/10.1016/j.comnet.2010.05.010",
    abstract: "This survey examines the Internet of Things as an ecosystem connecting physical objects through identification, sensing, communication, and intelligent processing technologies. It reviews major IoT visions, enabling technologies, application areas, networking challenges, interoperability, security, privacy, and future research directions.",
    verificationStatus: "verified"
  },
  {
    title: "Internet of Things: Vision, Applications and Research Challenges",
    authors: "Daniele Miorandi, Sabrina Sicari, Francesco De Pellegrini, Imrich Chlamtac",
    category: "Internet of Things",
    year: 2012,
    doi: "10.1016/j.adhoc.2012.02.016",
    sourceUrl: "https://doi.org/10.1016/j.adhoc.2012.02.016",
    abstract: "This survey provides a broad overview of Internet-of-Things technologies, applications, and research challenges. It examines the integration of distributed devices with identification, sensing, and actuation capabilities and discusses issues involving networking, security, privacy, scalability, and practical IoT deployment.",
    verificationStatus: "verified"
  },
  {
    title: "The Effects of Continuous Integration on Software Development: A Systematic Literature Review",
    authors: "Eliezio Soares, Gustavo Sizilio, Jadson Santos, Daniel Alencar da Costa, Uirá Kulesza",
    category: "Software Engineering",
    year: 2022,
    doi: "10.1007/s10664-021-10114-1",
    sourceUrl: "https://doi.org/10.1007/s10664-021-10114-1",
    abstract: "This systematic literature review examines empirical evidence about the effects of continuous integration on software development. It analyzes reported benefits and drawbacks associated with continuous integration and synthesizes findings from studies investigating its adoption and impact on software development practices.",
    verificationStatus: "verified"
  },
  {
    title: "Technical Debt: From Metaphor to Theory and Practice",
    authors: "Philippe Kruchten, Robert L. Nord, Ipek Ozkaya",
    category: "Software Engineering",
    year: 2012,
    doi: "10.1109/MS.2012.167",
    sourceUrl: "https://doi.org/10.1109/MS.2012.167",
    abstract: "This paper examines technical debt as a concept for understanding the long-term consequences of software-development decisions. It discusses the causes and forms of technical debt and describes approaches for identifying, organizing, and managing debt during the evolution of software systems.",
    verificationStatus: "verified"
  },
  {
    title: "Basic Local Alignment Search Tool",
    authors: "Stephen F. Altschul, Warren Gish, Webb Miller, Eugene W. Myers, David J. Lipman",
    category: "Bioinformatics",
    year: 1990,
    doi: "10.1016/S0022-2836(05)80360-2",
    sourceUrl: "https://doi.org/10.1016/S0022-2836(05)80360-2",
    abstract: "This paper introduces BLAST, a computational method for rapidly comparing biological sequences. The approach identifies locally similar regions between DNA or protein sequences and provides statistical measures for evaluating sequence matches, making large-scale sequence analysis practical.",
    verificationStatus: "verified"
  },
  {
    title: "Bioconductor: Open Software Development for Computational Biology and Bioinformatics",
    authors: "Robert C. Gentleman, Vincent J. Carey, Douglas M. Bates, Ben Bolstad, Marcel Dettling, Sandrine Dudoit, Byron Ellis, Laurent Gautier, Yongchao Ge, Jeff Gentry, Kurt Hornik, Torsten Hothorn, Wolfgang Huber, Stefano Iacus, Rafael Irizarry, Friedrich Leisch, Cheng Li, Maechler, Anthony J. Rossini, Gunther Sawitzki, Colin Smith, Gordon Smyth, Luke Tierney, Jean Y. H. Yang, Jianhua Zhang",
    category: "Bioinformatics",
    year: 2004,
    doi: "10.1186/gb-2004-5-10-r80",
    sourceUrl: "https://doi.org/10.1186/gb-2004-5-10-r80",
    abstract: "This paper describes the Bioconductor project, an open software-development initiative for computational biology and bioinformatics. It focuses on creating extensible research software, supporting biological data analysis, reducing barriers to interdisciplinary research, and improving reproducibility of computational results.",
    verificationStatus: "verified"
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected for massive seeding');
    
    for (const p of papers) {
      const newPaper = new Paper(p);
      await newPaper.save();
      console.log('Seeded:', p.title);
    }
    
    console.log('Massive seeding complete');
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
