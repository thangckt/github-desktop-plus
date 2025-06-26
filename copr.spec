Name: github-desktop-plus
Version: 0.4.21
Release: 1%{?dist}
Summary: GitHub Desktop Plus, a GUI client for Git and GitHub

License: MIT
URL: https://github.com/pol-rivero/github-desktop-plus
Source0: %{url}/archive/v%{version}/%{name}-%{version}.tar.gz

%if 0%{?fedora} > 41
ExcludeArch:   %{ix86}
%endif

BuildRequires: git
BuildRequires: nodejs
BuildRequires: npm
BuildRequires: electron
BuildRequires: desktop-file-utils
BuildRequires: libappindicator

Requires: git
Requires: electron
Requires: libappindicator
Requires: gnome-keyring
Requires: libsecret

%description
GitHub Desktop provides a graphical user interface for interacting with Git and GitHub repositories. It simplifies Git operations such as cloning, committing, and creating pull requests, tailored for Linux environments.

%prep
%autosetup -n %{name}-%{version}

%build
npm install
npm run build

%install
mkdir -p %{buildroot}%{_datadir}/%{name}
cp -r dist/* %{buildroot}%{_datadir}/%{name}

mkdir -p %{buildroot}%{_datadir}/applications
cat > %{buildroot}%{_datadir}/applications/%{name}.desktop << EOF
[Desktop Entry] Name=GitHub Desktop Plus
Comment=Simple collaboration from your desktop
Exec=%{_datadir}/%{name}/github-desktop-plus --no-sandbox
Terminal=false
Type=Application
Icon=%{_datadir}/%{name}/assets/icon.png
Categories=Development;VersionControl;
EOF

mkdir -p %{buildroot}%{_datadir}/pixmaps
cp assets/icon.png %{buildroot}%{_datadir}/pixmaps/%{name}.png

mkdir -p %{buildroot}%{_bindir}
cat > %{buildroot}%{_bindir}/%{name} << EOF
#!/bin/sh
exec electron %{_datadir}/%{name}/main.js --no-sandbox "$@"
EOF
chmod +x %{buildroot}%{_bindir}/%{name}

%post
update-desktop-database &>/dev/null || :

%postun
update-desktop-database &>/dev/null || :

%files
%license LICENSE
%doc README.md
%{_bindir}/%{name}
%{_datadir}/%{name}/
%{_datadir}/applications/%{name}.desktop
%{_datadir}/pixmaps/%{name}.png

%changelog
* Thu Jun 26 2025 Your Name <your.email@example.com> - 3.4.21-1
- Initial package release