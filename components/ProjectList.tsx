'use client';
import { Project } from '@/data/projects';
import { FaBriefcase, FaClock, FaDollarSign, FaStar, FaCheckCircle, FaGraduationCap, FaBolt } from 'react-icons/fa';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function ProjectList({ projects, onSelectProject }: ProjectListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Medium': return { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-300', text: 'text-blue-900' };
      case 'Hard': return { bg: 'from-orange-50 to-amber-50', border: 'border-orange-300', text: 'text-orange-900' };
      case 'Expert': return { bg: 'from-purple-50 to-pink-50', border: 'border-purple-300', text: 'text-purple-900' };
      default: return { bg: 'from-slate-50 to-slate-100', border: 'border-slate-300', text: 'text-slate-900' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-2xl p-5 text-white shadow-lg border-2 border-blue-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <FaBriefcase className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold mb-1">Available Projects</h2>
              <p className="text-sm text-blue-100 font-medium">Choose a project to start earning</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-100 font-medium">{projects.length} Active Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-blue-100 font-medium">Real-time task generation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, index) => {
          const diffColors = getDifficultyColor(project.difficulty);
          
          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Project Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b-2 border-slate-200">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 bg-gradient-to-r ${diffColors.bg} ${diffColors.text} rounded-full text-[10px] font-extrabold border-2 ${diffColors.border} shadow-sm`}>
                        {project.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold border-2 border-slate-300">
                        {project.category}
                      </span>
                      {project.trainingRequired && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold border-2 border-amber-300 flex items-center gap-1">
                          <FaGraduationCap className="text-[10px]" />
                          Training
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-1">{project.name}</h3>
                    <p className="text-xs text-slate-600 font-medium mb-1">Client: <span className="text-blue-900 font-bold">{project.client}</span></p>
                    <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2">
                    <div className="flex-1 md:flex-none bg-gradient-to-br from-emerald-50 to-green-50 p-3 rounded-xl text-center border-2 border-emerald-300 shadow-md md:min-w-[100px]">
                      <FaDollarSign className="text-emerald-600 mx-auto mb-1 text-lg" />
                      <p className="text-xl font-extrabold text-emerald-700">${project.payPerTask.toFixed(2)}</p>
                      <p className="text-[9px] text-emerald-600 font-bold uppercase">Per Task</p>
                    </div>
                    <div className="flex-1 md:flex-none bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl text-center border-2 border-blue-300 shadow-md md:min-w-[100px]">
                      <FaClock className="text-blue-600 mx-auto mb-1 text-lg" />
                      <p className="text-base font-extrabold text-blue-700">{project.estimatedTimePerTask}</p>
                      <p className="text-[9px] text-blue-600 font-bold uppercase">Per Task</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FaBolt className="text-amber-500 text-xs" />
                    What You'll Do:
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {project.longDescription}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Requirements:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {project.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border-2 border-purple-200 text-center">
                    <FaStar className="text-purple-600 mx-auto mb-1 text-sm" />
                    <p className="text-base font-extrabold text-purple-900">{project.qualityThreshold}%</p>
                    <p className="text-[9px] text-purple-700 font-medium">Quality</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 rounded-lg border-2 border-cyan-200 text-center">
                    <FaCheckCircle className="text-cyan-600 mx-auto mb-1 text-sm" />
                    <p className="text-base font-extrabold text-cyan-900">{project.estimatedTasksAvailable}</p>
                    <p className="text-[9px] text-cyan-700 font-medium">Available</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-3 rounded-lg border-2 border-amber-200 text-center">
                    <FaDollarSign className="text-amber-600 mx-auto mb-1 text-sm" />
                    <p className="text-base font-extrabold text-amber-900">${(project.payPerTask * 10).toFixed(2)}</p>
                    <p className="text-[9px] text-amber-700 font-medium">Est/hr</p>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={() => onSelectProject(project)}
                  className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 hover:from-blue-950 hover:via-blue-900 hover:to-cyan-800 text-white py-3 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-blue-700 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 via-blue-800 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FaBolt className="text-sm" />
                    Start Tasking on This Project
                  </span>
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center shadow-2xl border-2 border-slate-200">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FaBriefcase className="text-5xl text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No Projects Available</h3>
          <p className="text-slate-600 mb-6">Check back soon for new opportunities</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-900 to-cyan-700 hover:from-blue-950 hover:to-cyan-800 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Refresh Projects
          </button>
        </div>
      )}
    </div>
  );
}
