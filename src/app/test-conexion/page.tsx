'use client';
import { useState } from 'react';
import { loginUser } from '../servicios/seguridad.service';
import { searchPatientsAdvanced } from '../servicios/business.service';

export default function TestConexion() {
  const [resultado, setResultado] = useState('');

  const probarTodo = async () => {
    try {
      setResultado('🔍 Probando conexión con AUTH SERVICE...\n');
      
      // 1. Login
      const loginData = await loginUser('cristian.1701421857@ucaldas.edu.co', '12345678');
      setResultado(prev => prev + '✅ Login exitoso\n');
      
      //  VERIFICAR Y GUARDAR TOKEN
      console.log('🔑 Token recibido:', loginData.accessToken);
      localStorage.setItem('auth_token', loginData.accessToken);
      setResultado(prev => prev + `🔑 Token guardado: ${loginData.accessToken ? 'SÍ' : 'NO'}\n`);
      
      //  VERIFICAR QUE EL TOKEN SE GUARDÓ
      const tokenGuardado = localStorage.getItem('auth_token');
      console.log('🔑 Token en localStorage:', tokenGuardado);
      setResultado(prev => prev + `🔑 Token en localStorage: ${tokenGuardado ? 'SÍ' : 'NO'}\n`);
      
  // 2. Buscar pacientes
  setResultado(prev => prev + '🔍 Buscando pacientes...\n');
  const pacientes = await searchPatientsAdvanced({ search: 'Fractura', page: 1, limit: 10 });
      
  setResultado(prev => prev + `✅ ${pacientes.patients.length} pacientes encontrados\n`);
  setResultado(prev => prev + `📊 Paginación: página ${pacientes.pagination.page} de ${pacientes.pagination.totalPages}\n`);
      
      setResultado(prev => prev + '\n🎉 ¡TODOS LOS SERVICIOS FUNCIONAN!\n');
      
    } catch (error) {
      const msg = (error as unknown as { message?: string })?.message || String(error);
      setResultado(prev => prev + `\n❌ Error: ${msg}\n`);
      console.error('Error completo:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prueba de Conexión - 3 Servicios</h1>
      <button 
        onClick={probarTodo}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Probar Conexión Completa
      </button>
      
      <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
        {resultado || 'Haz clic en el botón para probar...'}
      </pre>
    </div>
  );
}