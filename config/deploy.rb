# config valid for current version and patch releases of Capistrano
lock "~> 3.11.2"

set :application, "fullstack"
set :repo_url, "git@github.com:alaptev/fullstack.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :branch, 'master'

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"
# Deploy to the user's home directory
set :deploy_to, "/home/deploy/#{fetch :application}"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml"

# Optionally, you can symlink your database.yml and/or secrets.yml file from the shared directory during deploy
# This is useful if you don't want to use ENV variables
append :linked_files, 'config/database.yml', 'config/master.key', '.rbenv-vars'

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', '.bundle', 'public/system', 'public/uploads'

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

namespace :deploy do
  task :yarn_deploy do
    on roles fetch(:yarn_roles) do
      within fetch(:yarn_target_path, release_path) do
        execute fetch(:yarn_bin), 'gcp-postbuild'
      end
    end
  end

  before 'symlink:release', :yarn_deploy
end