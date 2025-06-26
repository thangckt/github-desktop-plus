Name:           github-desktop-plus
Version:        0.4.21
Release:        1%{?dist}
Summary:        GitHub Desktop Plus, a GUI client for Git and GitHub

License:        MIT
URL:            https://github.com/pol-rivero/github-desktop-plus
Source0:        %{url}/archive/v%{version}/%{name}-%{version}.tar.gz

BuildRequires:  git
BuildRequires:  nodejs
BuildRequires:  npm
BuildRequires:  electron-bin
Requires:       electron-bin
Requires:       git

%description
GitHub Desktop Plus provides a GUI for Git and GitHub, simplifying cloning, committing, and pull requests on Linux.

%prep
%autosetup -n %{name}-%{version}

%build
npm install
npm run build

%install
mkdir -p %{buildroot}%{_datadir}/%{name}
cp -r dist/* %{buildroot}%{_datadir}/%{name}

mkdir -p %{buildroot}%{_datadir}/applications
cat > %{buildroot}%{_datadir}/applications/%{name}.desktop << 'EOF'
[Desktop Entry]
Name=GitHub Desktop Plus
Exec=electron-bin %{_datadir}/%{name}/main.js --no-sandbox
Type=Application
Terminal=false
EOF

mkdir -p %{buildroot}%{_bindir}
ln -s /usr/bin/electron-bin %{buildroot}%{_bindir}/%{name}

%files
%license LICENSE
%{_bindir}/%{name}
%{_datadir}/%{name}/
%{_datadir}/applications/%{name}.desktop

%changelog
%autochangelog