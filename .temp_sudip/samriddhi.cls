\NeedsTeXFormat{LaTeX2e}[1996/12/01]
\providecommand{\classname}{samriddhi}
\ProvidesClass{\classname}[2019/02/01 v1.0]

%% Load base class using current setting for basic options.
\providecommand{\baseclass}{report}
\LoadClass[a4paper,12pt]{\baseclass}

%Loading required packages
\RequirePackage{graphicx}
\RequirePackage{float}
\RequirePackage{cite}
\RequirePackage{setspace}
\RequirePackage[T1]{fontenc}
\RequirePackage[utf8]{inputenc}
\RequirePackage{times}
\RequirePackage[top=1in,bottom=1in,left=1.5in,
right=1in]{geometry}
              
%FIGURES AND TABLES CAPTIONS
\RequirePackage[labelfont={bf,sf,small},
 labelsep=colon,justification=raggedright]			 {caption}
\setlength{\abovecaptionskip}{6pt}
\setlength{\belowcaptionskip}{0pt}

%SECTION/SUBSECTION/PARAGRAPH SET-UP
\RequirePackage{titlesec}
\titleformat{\chapter}[block]
{\vspace{6pt}\filcenter}
{\filcenter \large\bfseries
\MakeUppercase{\chaptertitlename}\ \justwords{\thechapter}:}
{6pt}
{\vspace*{12pt}\filcenter\large\bfseries}
\def\justwords#1{\ifcase#1 \or ONE\or TWO\or THREE\or FOUR\or FIVE \or SIX \or SEVEN \fi}

\titlespacing*{\chapter}{0pt}{*0}{*0}

\titleformat*{\section}{\normalsize\bfseries}
\titleformat*{\subsection}{\normalsize\bfseries}
\titlespacing*{\section}
{0pt}{6pt plus 2pt minus 1pt}{6pt plus 1pt}
\titlespacing*{\subsection}
{0pt}{6pt plus 2pt minus 1pt}{6pt plus 1pt}