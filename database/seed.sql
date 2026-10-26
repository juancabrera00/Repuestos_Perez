-- Catálogo inicial. No inserta de nuevo si el código ya existe.

INSERT INTO repuestos (codigo, nombre, categoria, marca, precio, stock, compatibilidad)
VALUES
  ('BUJ-NGK-01', 'Bujía NGK resistiva', 'Encendido', 'NGK', 18000, 24, ARRAY['Bajaj RE', 'Piaggio Ape']),
  ('FRE-DIS-12', 'Pastillas de freno delanteras', 'Frenos', 'Bosch', 45000, 8, ARRAY['Bajaj RE', 'TVS King']),
  ('FIL-ACE-03', 'Filtro de aceite', 'Filtros', 'Motul', 22000, 0, ARRAY['Bajaj RE', 'Piaggio Ape', 'TVS King']),
  ('CAD-TRA-07', 'Cadena de transmisión', 'Transmisión', 'Bajaj', 89000, 5, ARRAY['Bajaj RE']),
  ('AMP-FAR-04', 'Ampolleta de farola', 'Eléctrico', 'Philips', 12000, 31, ARRAY['Piaggio Ape', 'Motocarro 200']),
  ('KIT-EMB-09', 'Kit de embrague', 'Transmisión', 'TVS', 135000, 3, ARRAY['TVS King']),
  ('BAL-DIR-11', 'Balinera de dirección', 'Motor', 'SKF', 38000, 12, ARRAY['Bajaj RE', 'Motocarro 200']),
  ('CAB-ACE-02', 'Cable de acelerador', 'Motor', 'Generic', 15000, 2, ARRAY['Piaggio Ape', 'Motocarro 200']),
  ('FIL-AIR-08', 'Filtro de aire', 'Filtros', 'Bosch', 27000, 0, ARRAY['TVS King', 'Bajaj RE']),
  ('SWI-Luz-15', 'Switch de luces', 'Eléctrico', 'Generic', 19000, 17, ARRAY['Bajaj RE', 'Piaggio Ape', 'TVS King', 'Motocarro 200']),
  ('ZAP-FRE-06', 'Zapatas de freno traseras', 'Frenos', 'Bajaj', 32000, 4, ARRAY['Bajaj RE', 'Motocarro 200']),
  ('RET-CIG-10', 'Retén de cigüeñal', 'Motor', 'TVS', 14000, 9, ARRAY['TVS King'])
ON CONFLICT (codigo) DO NOTHING;
